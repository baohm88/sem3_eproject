import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PaginationBar from "./PaginationBar";
import TransactionList from "./TransactionList";

/**
 * TransactionsModal (shared across Company/Driver/Admin...)
 *
 * Props:
 * - show: boolean
 * - onHide: () => void
 * - title?: string (default "All Transactions")
 * - perspectiveWalletId?: string (to color +/- amounts from a wallet's perspective)
 * - fetchPage: (page: number, size: number) => Promise<PageResultLike>
 *     PageResultLike: { items, totalItems, totalPages, page, size }
 * - pageSizeOptions?: number[] (default [10, 20, 50])
 */
export default function TransactionsModal({
  show,
  onHide,
  title = "All Transactions",
  perspectiveWalletId,
  fetchPage,
  pageSizeOptions = [10, 20, 50],
}) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // current page index (1-based)
  const [size, setSize] = useState(pageSizeOptions[0]); // current page size
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    page: 1,
    size: pageSizeOptions[0],
  });

  // Fetch current page of data
  const loadData = async () => {
    // Guard: only fetch when modal is visible and a fetcher is provided
    if (!show || !fetchPage) return;
    setLoading(true);
    try {
      const res = await fetchPage(page, size);
      setData({
        items: res?.items || [],
        totalItems: res?.totalItems ?? 0,
        totalPages: res?.totalPages ?? 0,
        page: res?.page ?? page,
        size: res?.size ?? size,
      });
    } catch (e) {
      // Surface a friendly error toast
      toast.error(e?.message || "Cannot load transactions");
    } finally {
      setLoading(false);
    }
  };

  // When modal opens OR page/size changes → fetch that page
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, page, size]);

  // When modal closes → reset pagination to defaults and clear items
  useEffect(() => {
    if (!show) {
      setPage(1);
      setSize(pageSizeOptions[0]);
      setData((d) => ({ ...d, items: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="py-4 text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <TransactionList
              transactions={data.items}
              perspectiveWalletId={perspectiveWalletId}
              emptyText="No transactions"
              // Do not pass "limit" → render all items of the current page
            />

            <div className="mt-3">
              <PaginationBar
                page={page}
                size={size}
                totalItems={data.totalItems}
                totalPages={data.totalPages}
                onPageChange={setPage}
                onSizeChange={setSize}
                sizeOptions={pageSizeOptions}
              />
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
