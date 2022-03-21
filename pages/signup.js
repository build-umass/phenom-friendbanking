import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import clientPromise from '../lib/mongodb'

export default function Signup({ isConnected }) {
    return (
        <div></div>
    )
}

// https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export async function getServerSideProps(context) {
    try {
      // client.db() will be the default database passed in the MONGODB_URI
      // You can change the database by calling the client.db() function and specifying a database like:
      // const db = client.db("myDatabase");
      // Then you can execute queries against your database like so:
      // db.find({}) or any of the MongoDB Node Driver commands
      await clientPromise
      return {
        props: { isConnected: true },
      }
    } catch (e) {
      console.error(e)
      return {
        props: { isConnected: false },
      }
    }
  }