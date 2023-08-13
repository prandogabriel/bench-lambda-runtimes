import LambdaGolang from "./scenarios/golang.mjs";
import LambdaNodejs from "./scenarios/nodejs.mjs";
import { group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  // iterations: 2,
  // duration: "60s",
  stages: [
    { duration: "5s", target: "10" },
    { duration: "20s", target: "50" },
    { duration: "15s", target: "30" },
    { duration: "10s", target: "20" },
    { duration: "5s", target: "10" },
    { duration: "5s", target: "5" },
  ],
};

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default () => {
  group("Lambda Golang", () => {
    LambdaGolang();
  });

  group("Lambda Nodejs", () => {
    LambdaNodejs();
  });
};
