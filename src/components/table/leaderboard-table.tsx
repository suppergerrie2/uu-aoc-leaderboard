import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { testData } from "../../shared/testData";
import { calculateScores } from "./calculatescores";
import {
  miliSecondTableFormatter,
  starTableFormatter,
} from "./leaderboard-table-formatters";
import {
  APIData,
  Column,
  PreProcessData,
  Row,
  StarData,
} from "./leaderboard-table.types";
import styles from "./table.module.scss";

const columns: readonly Column[] = [
  { id: "user", label: "Name", minWidth: 75 },
  { id: "score", label: "Score", minWidth: 75 },

  {
    id: "stars",
    label: "Stars",
    minWidth: 75,
    format: starTableFormatter,
  },
  {
    id: "totalTime",
    label: "Total time",
    minWidth: 75,
    format: miliSecondTableFormatter,
  },
];

function LeaderBoardTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getRowsJSX = (rows: Row[]) => {
    return rows
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row) => {
        return (
          <TableRow
            className={styles["theme-table-row"]}
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.user}
          >
            {columns.map((column) => {
              const value = row[column.id];
              return (
                <TableCell
                  className={styles["theme-table-cell"]}
                  key={column.id}
                  align={column.align}
                  style={{ backgroundColor: "#393e46" }}
                >
                  {column.format ? column.format(value) : value}
                </TableCell>
              );
            })}
          </TableRow>
        );
      });
  };

  const mapData = (input: APIData[]) => {
    const data = getPreProcessedData(input);
    var grouped = _.mapValues(_.groupBy(data, "username"), (list) =>
      list.map((user) => _.omit(user, "username"))
    );
    const scoreMap = calculateScores(data);
    var rowData = [] as Row[];
    Object.entries(grouped).forEach((userEntry) => {
      const stars = userEntry[1].map((x) => {
        return { day: x.day, one: !!x.starOne, two: !!x.starTwo } as StarData;
      });
      const row: Row = {
        user: userEntry[0],
        stars: _.sortBy(stars, ["day"], ["asc"]),
        score: scoreMap.get(userEntry[0])?.score,
        totalTime: scoreMap.get(userEntry[0])?.totalTimeTakenMs,
      };
      rowData.push(row);
    });

    return rowData;
  };

  const getPreProcessedData = (data: APIData[]) => {
    return (
      data
        // We do not care for anything that will not result in a score
        .filter((x) => x.starOne && x.startTime)
        .map((x) => {
          const startTime = new Date(x.startTime);
          const starOne = new Date(x.starOne);
          const starTwo = x.starTwo ? new Date(x.starTwo) : null;
          return {
            day: x.day,
            year: x.year,
            username: x.username,
            starOne,
            starTwo,
            startTime,
            timeTakenMsOne: getTimeTaken(startTime, starOne),
            timeTakenMsTwo: getTimeTaken(startTime, starTwo),
          } as PreProcessData;
        })
    );
  };

  const getTimeTaken = (startTime: Date, star: Date) => {
    if (!startTime || !star) {
      return null;
    }
    return star.valueOf() - startTime.valueOf();
  };

  const rows = getRowsJSX(mapData(testData));

  return (
    <Paper className={styles["theme-paper"]}>
      <TableContainer style={{ maxHeight: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className={styles["theme-table-header-row"]}>
              {columns.map((column) => (
                <TableCell
                  className={styles["theme-table-header-cell"]}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={styles["theme-table-body"]}>{rows}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default LeaderBoardTable;
