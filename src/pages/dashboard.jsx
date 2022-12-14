import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, collection, doc, updateDoc, where, query } from 'firebase/firestore';
import Modal from '../components/modal';
import { useNavigate } from 'react-router-dom';


const Dashboard = ({ database }) => {
  const userEmail = localStorage.getItem('userEmail')
  const nav = useNavigate();
  const auth = getAuth();
  const collectionRef = collection(database, 'userPasswords');
  const emailQuery = query(collectionRef, where('email', '==', userEmail))
  const [passwordArray, setPasswordArray] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);
  const [infoValues, setInfoValues] = useState({});
  const [onEdit, setOnEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false)

  const getPasswords = () => {
    onSnapshot(emailQuery, (res) => {
      setId(res.docs[0].id)
      setPasswordArray(res.docs[0].data().accountsInfo);
    })
  }
  // console.log(passwordArray);

  useEffect(() => {
    onAuthStateChanged(auth, res => {
      if (res) {
        getPasswords()
      } else {
        nav("/login")
      }
    })
  }, [])


  const onCloseModal = () => {
    setOpenModal(prev => !prev)
    setInfoValues({})
    setShow(false)
  }

  const deleteInfo = async (info) => {
    const docToDelete = doc(database, "userPasswords", id )
    await updateDoc(docToDelete, {
      accountsInfo: passwordArray?.filter((item => item !== info))
    })
  }

  const showPassword = (info) => {
    setInfoValues(info)
    setOpenModal(true)
    setShow(true)
  }
  const logOut = () => {
    signOut(auth)
      .then(() => {
        nav("/login")
        localStorage.removeItem('userEmail')
      })
  }
  const handleOpen = (info) => {
    setInfoValues(info)
    setOpenModal(true)
    setOnEdit(true)
  }
  const onSubmitForm = () => {
    if (onEdit) {
      const docToUpdate = doc(database, "userPasswords", id )
      updateDoc(docToUpdate, {
        accountsInfo: passwordArray?.map((p) => p.id == infoValues.id ? { ...p, name: infoValues.name, password: infoValues.password } : p)
      })
      setOnEdit(false)
      setOpenModal(false)
      setInfoValues({})
    } else {
      const docToUpdate = doc(database, "userPasswords", id )
      updateDoc(docToUpdate, {
        accountsInfo: [...passwordArray, infoValues]
      })
      setOpenModal(false)
      setInfoValues({})
    }
  }


  return (
    <div className='container card'>
      <div className='card-container'>
        <div className='btn-container'>
          <Button onClick={() => setOpenModal(prev => !prev)}>Add password</Button>
          <Button type="primary" onClick={() => logOut()} style={{ marginLeft: 20 }}>Log out</Button>
        </div>

        <Card title="Create password for your businesses">
          {passwordArray?.map((info) => (
            <div key={info.name}>
                <div className='info-container' key={info.id}>
                  <p>{info.name}</p>
                  <div className='icons-container'>
                    <EyeOutlined className='icon-eye' onClick={() => showPassword(info)} />
                    <EditOutlined className='icon-edit' onClick={() => handleOpen(info)} />
                    <DeleteOutlined className='icon-delete' onClick={() => deleteInfo(info)} />
                  </div>
                </div>
            </div>
          )
          )
          }
        </Card>
        {openModal && (
          <Modal
            title={'Add info'}
            onOpen={openModal}
            // onOk={addInfo}
            onCancel={onCloseModal}
            footer={[
              <Button key="cancel" onClick={onCloseModal}>
                Cancle
              </Button>,
              <Button key="submit" type="primary" disabled={show || (!infoValues.name || !infoValues.password)} onClick={onSubmitForm}>
                Submit
              </Button>,
            ]}
          >
            <Form
              layout="vertical"
              initialValues={infoValues}
              onValuesChange={(_, allFields) => {
                setInfoValues({ ...allFields, id: infoValues.id === undefined ? Math.floor(Math.random() * 100) : infoValues.id })
              }}
            >
              <Form.Item
                name='name'
                label="Name"
              >
                <Input readOnly={show} />
              </Form.Item>
              <Form.Item
                name='password'
                label="Password"
              >
                <Input.Password readOnly={show} />
              </Form.Item>
            </Form>
          </Modal>
        )
        }
      </div>
    </div>
  )
}

export default Dashboard