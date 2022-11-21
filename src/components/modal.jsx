import React from 'react'
import { Modal as AntModal } from 'antd';

const Modal = ({ title,children, onOk, onOpen, onCancel }) => {
    return (
        <AntModal
            title={title}
            centered
            style={{
                top: 20,
            }}
            open={onOpen}
            onOk={onOk}
            onCancel={onCancel}
        >
            {children}
        </AntModal>
    )
}

export default Modal