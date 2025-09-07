import { useEffect, useMemo, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    getMyCompany,
    updateMyCompany,
    getCompanyWallet,
    listCompanyTransactions,
    topupCompanyWallet,
    withdrawCompanyWallet,
} from "../../api/companies";

import CompanyIdentity from "../../components/company/CompanyIdentity";
import EditProfileModal from "../../components/common/EditProfileModal";
import WalletBalance from "../../components/common/WalletBalance";
import RecentTransactions from "../../components/common/RecentTransactions";
import TopUpModal from "../../components/common/TopUpModal";
import WithdrawModal from "../../components/common/WithdrawModal";

export default function CompanyProfilePage() {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [txs, setTxs] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const dashboardPath = useMemo(() => "/company", []);
    const placeholderLogo =
        "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&auto=format&fit=crop&q=60";

    const refreshWalletAndTx = async (cid) => {
        try {
            const w = await getCompanyWallet(cid);
            setWallet(w);
            const tRes = await listCompanyTransactions(cid, {
                size: 5,
                page: 1,
            });
            setTxs(tRes.items || []);
        } catch (e) {
            // có thể hiện toast nếu muốn
        }
    };

    const editFields = [
        {
            name: "name",
            label: "Name",
            placeholder: "Company name",
        },
        {
            name: "description",
            label: "Description",
            as: "textarea",
            rows: 3,
            placeholder: "What does your company do?",
        },
        {
            name: "imgUrl",
            label: "Logo URL",
            placeholder: "https://...",
        },
    ];

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

    const handleSaveProfile = async (payload) => {
        const updated = await updateMyCompany(payload);
        setCompany(updated);
    };

    // Handlers TopUp / Withdraw
    const handleTopUpConfirm = async ({ amountCents, idempotencyKey }) => {
        if (!company?.id) throw new Error("Missing company id");
        await topupCompanyWallet(company.id, { amountCents, idempotencyKey });
        await refreshWalletAndTx(company.id);
    };

    const handleWithdrawConfirm = async ({ amountCents, idempotencyKey }) => {
        await withdrawCompanyWallet(company.id, {
            amountCents,
            idempotencyKey,
        });
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
            <div className="py-5 text-center text-muted">
                No company profile.
            </div>
        );
    }

    return (
        <>
            <Row className="gy-3 align-items-stretch mt-3">
                {/* 1) CompanyIdentity */}
                <Col xs={12} md={6} lg={5}>
                    <CompanyIdentity
                        company={company}
                        placeholderLogo={placeholderLogo}
                        onEdit={() => setShowEdit(true)}
                        dashboardPath={dashboardPath}
                    />
                </Col>

                {/* 2) WalletBalance + 3) RecentTransactions */}
                <Col xs={12} md={6} lg={7}>
                    <Row className="g-3">
                        <Col xs={12}>
                            <WalletBalance
                                balanceCents={wallet?.balanceCents}
                                thresholdCents={wallet?.lowBalanceThreshold}
                                currencyLabel="₫"
                                onTopUp={() => setShowTopUp(true)}
                                onWithdraw={() => setShowWithdraw(true)}
                            />
                        </Col>
                        <Col xs={12}>
                            <RecentTransactions
                                transactions={txs}
                                limit={5}
                                perspectiveWalletId={wallet?.id}
                                title="Recent Transactions"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Modals */}
            <EditProfileModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                initial={company}
                onSave={handleSaveProfile}
                title="Edit Company"
                fields={editFields}
            />

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
        </>
    );
}
