import { Card, Button } from "react-bootstrap";
import TransactionList from "./TransactionList";
import type { Transaction } from "../../api/types";

type RecentTransactionsProps = {
  transactions: Transaction[];
  /** cắt số lượng hiển thị (mặc định: 10) */
  limit?: number;
  /** ví góc nhìn để tô màu +/- */
  perspectiveWalletId?: string;
  /** tiêu đề */
  title?: string; // default: "Recent Transactions"
  /** text khi rỗng */
  emptyText?: string; // default: "No transactions"
  /** hiển thị nút View all */
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
        {onViewAll && (
          <Button size="sm" variant="outline-secondary" onClick={onViewAll}>
            View all
          </Button>
        )}
      </Card.Header>

      <TransactionList
        transactions={transactions}
        limit={limit}
        perspectiveWalletId={perspectiveWalletId}
        emptyText={emptyText}
      />
    </Card>
  );
}
