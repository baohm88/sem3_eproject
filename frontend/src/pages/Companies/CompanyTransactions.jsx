// src/pages/Companies/CompanyTransactions.jsx
import { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getMyCompany,
  getCompanyWallet,
  listCompanyTransactions,
  topupCompanyWallet,
  withdrawCompanyWallet,
} from "../../api/companies";

import WalletBalance from "../../components/common/WalletBalance";
import RecentTransactions from "../../components/common/RecentTransactions";
import TopUpModal from "../../components/common/TopUpModal";
import WithdrawModal from "../../components/common/WithdrawModal";
import TransactionsModal from "../../components/common/TransactionsModal";

/**
 * CompanyTransactions
 * - Loads company, wallet, and recent transactions.
 * - Provides Top Up / Withdraw actions and a modal to view all transactions.
 */
export default function CompanyTransactions() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [txs, setTxs] = useState([]);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);

  // Fetch wallet + a small page of recent transactions
  const refreshWalletAndTx = async (cid) => {
    try {
      const w = await getCompanyWallet(cid);
      setWallet(w);
      const tRes = await listCompanyTransactions(cid, { page: 1, size: 10 });
      setTxs(tRes.items || []);
    } catch (e) {
      toast.error(e.message || "Cannot load company wallet");
    }
  };

  // Fetch company, then wallet + tx
  const refresh = async () => {
    setLoading(true);
    try {
      const c = await getMyCompany();
      setCompany(c);
      await refreshWalletAndTx(c.id);
    } catch (e) {
      toast.error(e?.message || "Cannot load company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Confirm handlers for top up / withdraw
  const handleTopUpConfirm = async ({ amountCents, idempotencyKey }) => {
    if (!company?.id) throw new Error("Missing company id");
    await topupCompanyWallet(company.id, { amountCents, idempotencyKey });
    await refreshWalletAndTx(company.id);
  };

  const handleWithdrawConfirm = async ({ amountCents, idempotencyKey }) => {
    await withdrawCompanyWallet(company.id, { amountCents, idempotencyKey });
    await refreshWalletAndTx(company.id);
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="py-5 text-center text-muted">No company profile.</div>
    );
  }

  return (
    <>
      <Row className="gy-3 align-items-stretch mt-3">
        {/* 1) WalletBalance */}
        <Col xs={12} md={6} lg={5}>
          <WalletBalance
            balanceCents={wallet?.balanceCents}
            thresholdCents={wallet?.lowBalanceThreshold}
            currencyLabel="₫"
            onTopUp={() => setShowTopUp(true)}
            onWithdraw={() => setShowWithdraw(true)}
          />
        </Col>

        {/* 2) RecentTransactions */}
        <Col xs={12} md={6} lg={7}>
          <RecentTransactions
            transactions={txs}
            limit={5}
            perspectiveWalletId={wallet?.id}
            title="Recent Transactions"
            onViewAll={() => setShowAllTx(true)}  // Open modal to view all
          />
        </Col>
      </Row>

      {/* Modals */}
      <TopUpModal
        show={showTopUp}
        onHide={() => setShowTopUp(false)}
        title="Top Up (Company)"
        currencyLabel="VND"
        onConfirm={handleTopUpConfirm}
      />

      <WithdrawModal
        show={showWithdraw}
        onHide={() => setShowWithdraw(false)}
        title="Withdraw (Company)"
        currencyLabel="VND"
        onConfirm={handleWithdrawConfirm}
      />

      {/* All Transactions Modal */}
      <TransactionsModal
        show={showAllTx}
        onHide={() => setShowAllTx(false)}
        title="All Transactions"
        perspectiveWalletId={wallet?.id}
        fetchPage={(page, size) =>
          listCompanyTransactions(company.id, { page, size })
        }
      />
    </>
  );
}
