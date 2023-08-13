import http from "k6/http";
import { Trend, Rate } from "k6/metrics";
import { check, fail, sleep } from "k6";

export let GetGolangDuration = new Trend("get_golang_duration");
export let GolangFailRate = new Rate("golang_fail_rate");
export let GolangSuccessRate = new Rate("golang_success_rate");
export let GolangRequisitionsRate = new Rate("golang_requisitions_rate");
let durationMsg = "Falha na execução do cenário golang";

export default function () {
  let res = http.get(process.env.GOLANG_URL);

  GetGolangDuration.add(res.timings.duration);
  GolangRequisitionsRate.add(1);
  GolangFailRate.add(res.status === 0 || res.status > 399);
  GolangSuccessRate.add(res.status < 399);

  if (
    !check(res, {
      "is statuscode 200 - endpoint user": (r) => r.status === 200,
    })
  ) {
    fail(durationMsg);
  }

  sleep(1);
}
