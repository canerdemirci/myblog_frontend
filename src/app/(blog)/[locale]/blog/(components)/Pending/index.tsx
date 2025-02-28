import clsx from "clsx"
import Modal from "../Modal"
import { ImSpinner11 } from "react-icons/im"

export default function Pending() {
    return (
        <Modal onClose={() => {}}>
            <div className={clsx([
                'w-screen', 'h-screen', 'flex', 'justify-center', 'items-center'
            ])}>
                <div className={clsx('animate-spin')}>
                    <ImSpinner11 size={52} className={clsx('dark:text-gray-100')} />
                </div>
            </div>
        </Modal>
    )
}