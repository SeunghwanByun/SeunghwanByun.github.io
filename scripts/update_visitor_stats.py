import datetime
import json
import os
import zoneinfo

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Metric, RunReportRequest
from google.oauth2 import service_account

KST = zoneinfo.ZoneInfo("Asia/Seoul")
EARLIEST_DATE = "2015-08-14"  # earliest date the GA4 Data API accepts


def pageviews_for_range(client, property_id, start_date, end_date):
    request = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        metrics=[Metric(name="screenPageViews")],
    )
    response = client.run_report(request)
    if not response.rows:
        return 0
    return int(response.rows[0].metric_values[0].value)


def main():
    property_id = os.environ["GA4_PROPERTY_ID"]
    credentials_info = json.loads(os.environ["GA4_SERVICE_ACCOUNT_KEY"])
    credentials = service_account.Credentials.from_service_account_info(
        credentials_info,
        scopes=["https://www.googleapis.com/auth/analytics.readonly"],
    )
    client = BetaAnalyticsDataClient(credentials=credentials)

    today = datetime.datetime.now(tz=KST).date()
    yesterday = today - datetime.timedelta(days=1)

    stats = {
        "today": {"pv": pageviews_for_range(client, property_id, "today", "today")},
        "yesterday": {"pv": pageviews_for_range(client, property_id, "yesterday", "yesterday")},
        "total": {"pv": pageviews_for_range(client, property_id, EARLIEST_DATE, "today")},
    }

    out_path = os.path.join(os.path.dirname(__file__), "..", "assets", "visitor-stats.json")
    with open(out_path, "w") as f:
        json.dump(stats, f, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
