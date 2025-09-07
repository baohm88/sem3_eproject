import { useEffect, useState } from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import DriverIdentity from "./DriverIdentity";
import EditProfileModal from "../../components/common/EditProfileModal";
import TagInput from "../../components/common/TagInput";
import WalletBalance from "../../components/common/WalletBalance";
import RecentTransactions from "../../components/common/RecentTransactions";
import WithdrawModal from "../../components/common/WithdrawModal";
import TopUpModal from "../../components/common/TopUpModal";

import {
    getMyDriverProfile,
    updateMyDriverProfile,
    getDriverWallet,
    listDriverTransactions,
    updateDriverAvailability,
    withdrawFromDriverWallet,
    topupDriverWallet,
} from "../../api/drivers";

import { jsonOrCsvToArray, arrayToJson } from "../../utils/skills.ts";

export default function DriverProfilePage() {
    const [loading, setLoading] = useState(true);
    const [driver, setDriver] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [txs, setTxs] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [skillsCsv, setSkillsCsv] = useState("");
    const [bioExpanded, setBioExpanded] = useState(false);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const placeholderAvatar =
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1200&auto=format&fit=crop&q=60";

    const refreshWalletAndTx = async (driverUserId) => {
        try {
            const w = await getDriverWallet(driverUserId);
            setWallet(w);
            const tRes = await listDriverTransactions(driverUserId, {
                size: 3,
                page: 1,
            });

            setTxs(tRes.items || []);
        } catch {
            // optional log
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

    const onSaveProfile = async (payload) => {
        const arr = skillsCsv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const next = { ...payload, skills: arrayToJson(arr) };
        const updated = await updateMyDriverProfile(next);
        setDriver({ ...updated, skills: jsonOrCsvToArray(updated.skills) });
    };

    const toggleAvailable = async (next) => {
        try {
            const updated = await updateDriverAvailability(driver.userId, next);
            setDriver({ ...updated, skills: jsonOrCsvToArray(updated.skills) });
        } catch (e) {
            toast.error(e.message || "Update failed");
        }
    };

    useEffect(() => {
        if (showEdit && driver) {
            const arr = jsonOrCsvToArray(driver.skills);
            setSkillsCsv(arr.join(", "));
        }
    }, [showEdit, driver]);

    const truncate = (text, n = 160) =>
        text?.length > n ? text.slice(0, n) + "…" : text;

    if (loading) {
        return (
            <div className="py-5 text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="py-5 text-center text-muted">
                No driver profile.
            </div>
        );
    }

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
                    <DriverIdentity
                        driver={driver}
                        placeholderAvatar={placeholderAvatar}
                        onEdit={() => setShowEdit(true)}
                        onToggleAvailable={toggleAvailable}
                        bioExpanded={bioExpanded}
                        setBioExpanded={setBioExpanded}
                        truncate={truncate}
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
                                limit={10}
                                perspectiveWalletId={wallet?.id}
                                title="Recent Transactions"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Edit profile modal (giữ Skills bên trong modal) */}
            <EditProfileModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                initial={driver}
                onSave={onSaveProfile}
                title="Edit Driver Profile"
                fields={[
                    {
                        name: "fullName",
                        label: "Full name",
                        placeholder: "Nguyen Van A",
                    },
                    {
                        name: "phone",
                        label: "Phone",
                        placeholder: "+84 9xx xxx xxx",
                    },
                    {
                        name: "imgUrl",
                        label: "Avatar URL",
                        placeholder: "https://...",
                        helpText: "Bỏ trống để giữ nguyên",
                    },
                    {
                        name: "location",
                        label: "Location",
                        placeholder: "Ho Chi Minh",
                    },
                    {
                        name: "bio",
                        label: "Bio",
                        as: "textarea",
                        rows: 3,
                        placeholder: "Tell us about yourself...",
                    },
                ]}
            >
                <div className="mt-3">
                    <div className="mb-2 fw-semibold">Skills</div>
                    <TagInput value={skillsCsv} onChange={setSkillsCsv} />
                </div>
            </EditProfileModal>

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
        </>
    );
}
