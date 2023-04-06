<<<<<<< HEAD
=======
import { Fragment } from "react";
>>>>>>> 4f45d69 (eslint: add import order groups)
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export const Home: NextPage = () => {
  const router = useRouter();

  return (
    <Fragment>
      <Head>
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
      </Head>

      <main>
        <h2>Welcome To Next.js</h2>
      </main>
    </Fragment>
  );
};
