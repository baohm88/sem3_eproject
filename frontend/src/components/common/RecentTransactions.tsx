// src/components/common/RecentTransactions.tsx
import { Card, Button } from "react-bootstrap";
import TransactionList from "./TransactionList";
import type { Transaction } from "../../api/types";

/**
 * RecentTransactions
 *
 * Presentation component that wraps a <TransactionList /> in a Card
 * and (optionally) shows a "View all" button in the header.
 *
 * Notes:
 * - This component is purely presentational and controlled by its props.
 * - Use `perspectiveWalletId` to render amounts as income (+) or expense (-).
 */
type RecentTransactionsProps = {
  transactions: Transaction[];
  /** Limit the number of items shown in the list (default: 10). */
  limit?: number;
  /** Wallet ID used to determine +/- coloring based on the viewer's perspective. */
  perspectiveWalletId?: string;
  /** Card title text (default: "Recent Transactions"). */
  title?: string;
  /** Placeholder text when there are no transactions (default: "No transactions"). */
  emptyText?: string;
  /** If provided, a "View all" button will appear and call this handler when clicked. */
  onViewAll?: () => void;
};

export default function RecentTransactions({
  transactions,
  limit = 10,
  perspectiveWalletId,
  title = "Recent Transactions",
  emptyText = "No transactions",
  onViewAll,
}: RecentTransactionsProps) {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <strong>{title}</strong>

        {/* Optional "View all" CTA; only rendered if a handler is provided */}
        {onViewAll && (
          <Button size="sm" variant="outline-secondary" onClick={onViewAll}>
            View all
          </Button>
        )}
      </Card.Header>

      <TransactionList
        transactions={transactions}
        limit={limit} // show at most `limit` items here; use a modal/page to show the full history
        perspectiveWalletId={perspectiveWalletId}
        emptyText={emptyText}
      />
    </Card>
  );
}
