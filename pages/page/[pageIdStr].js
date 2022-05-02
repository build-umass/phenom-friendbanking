import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import clientPromise from "../../lib/mongodb";

export default function Create({ pageData }) {
  const [userData, setUserData] = useState({
    name: {value: '', valid: true},
    email: {value: '', valid: true},
    phone: {value: '1', valid: true},
    address1: {value: '', valid: true},
    address2: {value: '', valid: true},
    city: {value: '', valid: true},
    province: {value: '', valid: true},
    zip: {value: '', valid: true},
    desc: {value: '', valid: true}
  });

  function emailValid(){
    return String(userData.email.value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  function phoneValid(){
    return (userData.phone.value.length === 11);
  }

  function allValid() {
    return (userData.name.value.length > 0) && emailValid() && phoneValid() && (userData.address1.value.length > 0) && (userData.city.value.length > 0) && (userData.province.value.length > 0) && (userData.zip.value.length > 0);
  }

  function setValid(){
    console.log(emailValid())
    setUserData({...userData,
      email : {...userData.email, valid: emailValid() !== null},
      phone : {...userData.phone, valid: phoneValid()},
      name : {...userData.name, valid: !(userData.name.value.length === 0)},
      address1 : {...userData.address1, valid: !(userData.address1.value.length === 0)},
      city : {...userData.city, valid: !(userData.city.value.length === 0)},
      province : {...userData.province, valid: !(userData.province.value.length === 0)},
      zip : {...userData.zip, valid: !(userData.zip.value.length === 0)}
    });
  }

  return (
    //Make background based on what picture is in db
    <div className={styles.container}>
      <Head>
        <title>Phenom Friendbanking</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.createCard}>
          <h1 className='mb-3'>{pageData.pageTitle}</h1>
          <p className='mb-3'>{pageData.pageDescription}</p>

          <div className='mb-3'>
            <label htmlFor='title'>Full name</label>
            <input id='name' className='form-control' placeholder="Enter your full name" onChange={e => setUserData({...userData, name : {...userData.name, value: e.target.value}})}></input>
            {userData.name.valid ? null : <small style={{color: 'red'}}>Cannot be empty</small>}
          </div>

          <div className='mb-3'>
            <label htmlFor='title'>Email</label>
            <input id='email' className={'form-control ' + (userData.email.valid ? '' : styles.invalid)} placeholder="Enter your email" onChange={e => setUserData({...userData, email : {...userData.email, value: e.target.value}})}></input>
            {userData.email.valid ? null : <small style={{color: 'red'}}>Invalid email</small>}
          </div>

          <div className='mb-3'>
            <label>Voting Address</label>
            <small>  This is only used to determine congressional districts</small>
            <br></br>

            <small>Address Line 1</small>
            <input id='address' className={'form-control ' + (userData.address1.valid ? '' : styles.invalid)} onChange={e => setUserData({...userData, address1 : {...userData.address1, value: e.target.value}})}></input>
            {userData.address1.valid ? null : <small style={{color: 'red'}}>Cannot be empty</small>}
            <br/>

            <small>Address Line 2 <span className='text-muted' >Optional</span></small>
            <input id='address2' className='form-control' onChange={e => setUserData({...userData, address2 : {...userData.address2, value: e.target.value}})}></input>

            <small>City</small>
            <input id='city' className={'form-control ' + (userData.city.valid ? '' : styles.invalid)} onChange={e => setUserData({...userData, city : {...userData.city, value: e.target.value}})}></input>
            {userData.city.valid ? null : <small style={{color: 'red'}}>Cannot be empty</small>}
            <br/>

            <small>State / Province / Region</small>
            <input id='state' className={'form-control ' + (userData.province.valid ? '' : styles.invalid)} onChange={e => setUserData({...userData, province : {...userData.province, value: e.target.value}})}></input>
            {userData.province.valid ? null : <small style={{color: 'red'}}>Cannot be empty</small>}
            <br/>

            <small>Zip code</small>
            <input id='zip' className={'form-control ' + (userData.zip.valid ? '' : styles.invalid)} onChange={e => setUserData({...userData, zip : {...userData.zip, value: e.target.value}})}></input>
            {userData.zip.valid ? null : <small style={{color: 'red'}}>Cannot be empty</small>}
          </div>

          <div className='mb-3'>
            <label htmlFor='title'>Phone number</label>

            <PhoneInput
              inputClass={(userData.phone.valid ? '' : styles.invalid)}
              buttonClass={(userData.phone.valid ? '' : styles.invalid)}
              country={'us'}
              disableDropdown={true}
              countryCodeEditable={false}
              value={userData.phone.value}
              onChange={phoneval => setUserData({...userData, phone : {...userData.phone, value: phoneval}})}
            />
            {userData.phone.valid ? null : <small style={{color: 'red'}}>Invalid phone number</small>}
          </div>

          <div className='mb-3'>
            <label htmlFor='title'>Why do you want to support this cause? <span className='text-muted' >Optional</span></label>
            <textarea id='whysupport' className='form-control' rows='5' onChange={e => setUserData({...userData, desc : {...userData.desc, value: e.target.value}})}></textarea>
          </div>
          <button
            type="button"
            className={styles.createPageButton + " btn col-3 mt-3"}
            onClick={() => {
              if(allValid()){
                //send data to api route
                setValid();
                alert('valid');
              }
              else {
                setValid();
              }
            }}
          >
            Join the cause
          </button>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { pageIdStr } = context.query;

  const pageId = pageIdStr.split("-").pop();

  const client = await clientPromise;
  const db = client.db();

  const page = await db
    .collection("pages")
    .findOne({
      pageID: pageId
    });

  if (!page) {
    console.log("error");
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  return {
    props: {
      pageData: JSON.parse(JSON.stringify(page))
    }
  };
}
