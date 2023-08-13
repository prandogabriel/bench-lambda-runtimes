import http from "k6/http";
import { Trend, Rate } from "k6/metrics";
import { check, fail, sleep } from "k6";

export let GetNodejsDuration = new Trend("get_nodejs_duration");
export let NodejsFailRate = new Rate("nodejs_fail_rate");
export let NodejsSuccessRate = new Rate("nodejs_success_rate");
export let NodejsRequisitionsRate = new Rate("nodejs_requisitions_rate");
let durationMsg = "Falha na execução do cenário nodejs";

export default function () {
  let res = http.get(process.env.NODEJS_URL);

  GetNodejsDuration.add(res.timings.duration);
  NodejsRequisitionsRate.add(1);
  NodejsFailRate.add(res.status === 0 || res.status > 399);
  NodejsSuccessRate.add(res.status < 399);

  if (
    !check(res, {
      "is statuscode 200 - endpoint user": (r) => r.status === 200,
    })
  ) {
    fail(durationMsg);
  }

  sleep(1);
}
