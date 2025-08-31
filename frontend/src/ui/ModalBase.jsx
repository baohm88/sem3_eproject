import { Modal, Button, Spinner } from "react-bootstrap";

/**
 * ModalBase - Modal generic, tái sử dụng cho nhiều case.
 *
 * Props:
 * - show: boolean
 * - onHide: () => void
 * - title?: string | ReactNode
 * - size?: 'sm' | 'lg' | 'xl'
 * - centered?: boolean
 * - children: nội dung body
 * - confirmText?: string (default: 'Confirm')
 * - cancelText?: string (default: 'Cancel')
 * - onConfirm?: () => Promise<void> | void
 * - confirmVariant?: bootstrap variant (default: 'primary')
 * - confirmDisabled?: boolean
 * - busy?: boolean (hiển thị spinner + disable buttons)
 * - footer?: ReactNode (override footer mặc định)
 */
export default function ModalBase({
  show,
  onHide,
  title,
  size,
  centered = true,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmVariant = "primary",
  confirmDisabled = false,
  busy = false,
  footer,
}) {
  return (
    <Modal show={show} onHide={onHide} size={size} centered={centered}>
      {title !== undefined && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>{children}</Modal.Body>

      {footer !== undefined ? (
        <Modal.Footer>{footer}</Modal.Footer>
      ) : (
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={busy}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={busy || confirmDisabled}
            >
              {busy ? <Spinner size="sm" /> : confirmText}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
}
