import { useEffect, useState } from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import WalletBalance from "../../components/common/WalletBalance";
import RecentTransactions from "../../components/common/RecentTransactions";
import WithdrawModal from "../../components/common/WithdrawModal";
import TopUpModal from "../../components/common/TopUpModal";

import {
    getMyDriverProfile,
    getDriverWallet,
    listDriverTransactions,
    withdrawFromDriverWallet,
    topupDriverWallet,
} from "../../api/drivers";
import TransactionsModal from "../../components/common/TransactionsModal";

import { jsonOrCsvToArray } from "../../utils/skills.ts";

export default function DriverTransactions() {
    const [loading, setLoading] = useState(true);
    const [driver, setDriver] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [txs, setTxs] = useState([]);    
    const [showTopUp, setShowTopUp] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showAllTx, setShowAllTx] = useState(false); 

    const refreshWalletAndTx = async (driverUserId) => {
      setLoading(true);
      try {
        const w = await getDriverWallet(driverUserId);
        setWallet(w);
        const tRes = await listDriverTransactions(driverUserId, {
            size: 3,
            page: 1,
        });

        setTxs(tRes.items || []);
      } catch (e) {
        toast.error(e?.message || "Cannot load transactions");
      } finally {
        setLoading(false)
      }
    };

    const refresh = async () => {
        setLoading(true);
        try {
            const d = await getMyDriverProfile();
            // chuẩn hoá skills thành array cho DriverIdentity
            const skillsArr = jsonOrCsvToArray(d.skills);
            setDriver({ ...d, skills: skillsArr });
            await refreshWalletAndTx(d.userId);
        } catch (e) {
            toast.error(e.message || "Cannot load driver");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);


    if (loading) return <div className="py-5 text-center"><Spinner animation="border" /></div>;
    if (!driver) return <div className="py-5 text-center text-muted">No driver profile.</div>;

    // Handlers TopUp / Withdraw
    const handleTopUpConfirm = async ({ amountCents, idempotencyKey }) => {
        if (!driver?.userId) throw new Error("Missing driver userId");
        // NOTE: dùng userId cho nhất quán với các API driver khác
        await topupDriverWallet(driver.userId, { amountCents, idempotencyKey });
        await refreshWalletAndTx(driver.userId);
    };

    const handleWithdrawConfirm = async ({ amountCents, idempotencyKey }) => {
        await withdrawFromDriverWallet(driver.userId, {
            amountCents,
            idempotencyKey,
        });
        await refreshWalletAndTx(driver.userId);
    };

    return (
        <>
            <Row className="gy-3 align-items-stretch">
                {/* 1) DriverIdentity */}
                <Col xs={12} md={6} lg={5}>
                  <WalletBalance
                    balanceCents={wallet?.balanceCents}
                    thresholdCents={wallet?.lowBalanceThreshold}
                    currencyLabel="₫"
                    onTopUp={() => setShowTopUp(true)}
                    onWithdraw={() => setShowWithdraw(true)}
                  />
                </Col>

                {/* 2) WalletBalance + 3) RecentTransactions */}
                <Col xs={12} md={6} lg={7}>
                  <RecentTransactions
                    transactions={txs}
                    limit={10}
                    perspectiveWalletId={wallet?.id}
                    title="Recent Transactions"
                    onViewAll={() => setShowAllTx(true)}
                  />
                </Col>
            </Row>


            {/* TopUp & Withdraw dùng chung component */}
            <TopUpModal
                show={showTopUp}
                onHide={() => setShowTopUp(false)}
                title="Top Up (Driver)"
                currencyLabel="VND"
                onConfirm={handleTopUpConfirm}
            />

            <WithdrawModal
                show={showWithdraw}
                onHide={() => setShowWithdraw(false)}
                title="Withdraw (Driver)"
                currencyLabel="VND"
                onConfirm={handleWithdrawConfirm}
            />

            {/* NEW: TransactionsModal dùng chung */}
      <TransactionsModal
        show={showAllTx}
        onHide={() => setShowAllTx(false)}
        title="All Transactions"
        perspectiveWalletId={wallet?.id}
        fetchPage={(page, size) =>
          listDriverTransactions(driver.userId, { page, size })
        }
      />
        </>
    );
}
