import http from "k6/http";
import { Trend, Rate } from "k6/metrics";
import { check, fail, sleep } from "k6";

export let GetPythonDuration = new Trend("get_python_duration");
export let PythonFailRate = new Rate("python_fail_rate");
export let PythonSuccessRate = new Rate("python_success_rate");
export let PythonRequisitionsRate = new Rate("python_requisitions_rate");
let durationMsg = "Falha na execução do cenário Python";

export default function () {
  let res = http.get(process.env.PYTHON_URL);

  GetPythonDuration.add(res.timings.duration);
  PythonRequisitionsRate.add(1);
  PythonFailRate.add(res.status === 0 || res.status > 399);
  PythonSuccessRate.add(res.status < 399);

  if (
    !check(res, {
      "is statuscode 200 - endpoint user": (r) => r.status === 200,
    })
  ) {
    fail(durationMsg);
  }

  sleep(1);
}
