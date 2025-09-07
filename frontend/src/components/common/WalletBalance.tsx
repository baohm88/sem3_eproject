import { Card, Button, ProgressBar } from "react-bootstrap";

type WalletBalanceProps = {
  /** số dư (đơn vị cents) */
  balanceCents?: number | null;
  /** ngưỡng cảnh báo (cents) */
  thresholdCents?: number | null;
  /** nhãn tiền tệ hiển thị */
  currencyLabel?: string; // default: "₫"
  /** loading trạng thái số dư */
  loading?: boolean;

  /** bật tắt nhóm action mặc định */
  showActions?: boolean;     // default: true
  onTopUp?: () => void;
  onWithdraw?: () => void;

  /** custom actions thay thế (nếu muốn) */
  renderActions?: () => React.ReactNode;
};

const centsToDisplay = (c?: number | null, currency = "₫") =>
  c == null
    ? "--"
    : `${(Math.round(c) / 100).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ${currency}`;

export default function WalletBalance({
  balanceCents,
  thresholdCents,
  currencyLabel = "₫",
  loading = false,
  showActions = true,
  onTopUp,
  onWithdraw,
  renderActions,
}: WalletBalanceProps) {
  const progress =
    thresholdCents && thresholdCents > 0
      ? Math.min(100, ((balanceCents ?? 0) / thresholdCents) * 100)
      : undefined;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted">Wallet balance</div>
            <h3 className="mb-0">
              {loading ? "--" : centsToDisplay(balanceCents, currencyLabel)}
            </h3>
          </div>

          <div className="d-flex gap-2">
            {renderActions
              ? renderActions()
              : showActions && (
                  <>
                    {onTopUp && (
                      <Button size="sm" variant="success" onClick={onTopUp}>
                        Top up
                      </Button>
                    )}
                    {onWithdraw && (
                      <Button size="sm" variant="danger" onClick={onWithdraw}>
                        Withdraw
                      </Button>
                    )}
                  </>
                )}
          </div>
        </div>

        {typeof progress === "number" && (
          <div className="mt-3">
            <ProgressBar now={progress} />
            <div className="small text-muted mt-1">
              Low balance threshold: {centsToDisplay(thresholdCents, currencyLabel)}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
