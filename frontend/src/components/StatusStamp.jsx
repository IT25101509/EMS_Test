const TONE_MAP = {
  ACTIVE: "green",
  APPROVED: "green",
  PAID: "green",
  PRESENT: "green",
  PENDING: "amber",
  LATE: "amber",
  HALF_DAY: "amber",
  INACTIVE: "slate",
  CANCELLED: "slate",
  ON_LEAVE: "slate",
  TERMINATED: "red",
  REJECTED: "red",
  FAILED: "red",
  ABSENT: "red",
};

export default function StatusStamp({ status }) {
  if (!status) return null;
  const tone = TONE_MAP[status] || "slate";
  return <span className={`stamp stamp--${tone}`}>{status.replace(/_/g, " ")}</span>;
}
