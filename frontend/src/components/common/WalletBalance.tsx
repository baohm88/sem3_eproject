import { Card, Button, ProgressBar } from "react-bootstrap";

type WalletBalanceProps = {
  /** current balance (in cents) */
  balanceCents?: number | null;
  /** low-balance threshold (in cents) */
  thresholdCents?: number | null;
  /** currency label to display next to the amount (e.g., "₫", "VND") */
  currencyLabel?: string; // default: "₫"
  /** loading state for the balance value */
  loading?: boolean;

  /** toggle default action buttons group (Top up / Withdraw) */
  showActions?: boolean; // default: true
  onTopUp?: () => void;
  onWithdraw?: () => void;

  /** custom action renderer to replace the default buttons (if provided) */
  renderActions?: () => React.ReactNode;
};

/** Helper: format cents -> localized display string with currency suffix */
const centsToDisplay = (c?: number | null, currency = "₫") =>
  c == null
    ? "--"
    : `${(Math.round(c) / 100).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ${currency}`;

/**
 * WalletBalance
 * Lightweight card showing the wallet balance, optional actions, and a threshold progress bar.
 * - Uses `perspective` only for display; does not mutate data.
 */
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
  // Progress toward the low-balance threshold (caps at 100%)
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
              {/* Show placeholder while loading */}
              {loading ? "--" : centsToDisplay(balanceCents, currencyLabel)}
            </h3>
          </div>

          {/* Actions: prefer custom render; otherwise show default buttons if enabled */}
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

        {/* Show threshold progress only when it is computable */}
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
