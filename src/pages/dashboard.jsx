import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, collection, doc, updateDoc, deleteField, addDoc, where, query } from 'firebase/firestore';
import Modal from '../components/modal';
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom';


const gridStyle = {
  width: '100%',
  textAlign: 'center',
};

const Dashboard = ({ database }) => {
  const userEmail = sessionStorage.getItem('userEmail')
  const nav = useNavigate();
  const auth = getAuth();
  const collectionRef = collection(database, 'userPasswords');
  const emailQuery = query(collectionRef, where('email', '==', userEmail))
  const [passwordArray, setPasswordArray] = useState([]);
  const [id, setId] = useState(null);
  const [infoValues, setInfoValues] = useState({});
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, res => {
      if (res) {
        getPasswords()
      } else {
        nav("/login")
      }
    })
  }, [])
  console.log("passwordArray", id);
  const getPasswords = () => {
    onSnapshot(emailQuery, (res) => {
      setId(res.docs.map((item) => {
        return item.id.toString('') 
      }))
      setPasswordArray(res.docs.map((item) => {
        return { ...item.data() }
      }));

    })
  }
  const onCloseModal = () => {
    setOpenModal(prev => !prev)
    setInfoValues({})
  }
  const addInfo = () => {
    const docToUpdate = doc(database, "userPasswords", id && id[0])
    updateDoc(docToUpdate, {
      accountsInfo: [...passwordArray[0]?.accountsInfo, infoValues]
    })
    setOpenModal(false)
    setInfoValues({})
  }
  // const deleteInfo = (id) => {
  //   console.log("info",id);
  //   const docToDelete = doc(database, "userPasswords", id[0])
  //   updateDoc(docToDelete, {
  //     accountsInfo: 
  //   })
  //   setOpenModal(false)
  // }
  // const addInfo = async () => {
  //   const docRef = await addDoc(collection(database, 'userPasswords'), {
  //     accountsInfo: infoValues
  //   })
  //   console.log(docRef.id);
  //   setOpenModal(false)
  // }

  const editInfo = () => {
    const docToUpdate = doc(database, "userPasswords", id[0])
    updateDoc(docToUpdate, {
      accountsInfo: [...passwordArray[0]?.accountsInfo, infoValues]
    })
    setOpenModal(false)
  }
  const showPassword = (info) => {
    console.log(info);
    setInfoValues(info)
    setOpenModal(true)
  }
  const logOut = () => {
    signOut(auth)
      .then(() => {
        nav("/login")
        sessionStorage.removeItem('userEmail')
      })
  }
  return (
    <div className='container card'>
      <Button type="primary" onClick={() => setOpenModal(prev => !prev)}>Add password</Button>
      <Button type="primary" onClick={() => logOut()}>Log out</Button>
      <div className='card-container'>

        <Card title="Card Title">
          {passwordArray?.map((item) => {
            return (
              <div>
                {item?.accountsInfo?.map((info) => {
                  return (
                    <div className='info-container'>
                      <p>{info.name}</p>
                      <div className='icons-container'>
                        <EyeOutlined className='icon-eye' onClick={() => showPassword(info)} />
                        <EditOutlined className='icon-edit' />
                        {/* <DeleteOutlined className='icon-delete' onClick={() => deleteInfo(info.id)} /> */}
                      </div>
                      {/* <p>{info.password}</p> */}
                    </div>
                  )
                })}
              </div>
            )
          })
          }
        </Card>
        {openModal && (

          <Modal
            title={'Add info'}
            onOpen={openModal}
            onOk={addInfo}
            onCancel={onCloseModal}
          >
            <Form
              layout="vertical"
              initialValues={infoValues}
              onValuesChange={(_, allFields) => {
                setInfoValues({ ...allFields, id: Math.floor(Math.random() * 100) })
              }}
            >
              <Form.Item
                name='name'
                label="Name"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='password'
                label="Password"
              >
                <Input.Password />
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