import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardDescription,
  Divider,
  Header,
  Segment,
} from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { BlogPost, getBlogPosts } from '../util/database';

type Props = {
  blogPosts: BlogPost[];
  userObject: { username: string };
};

export default function BlogPostList(props: Props) {
  const [search, setSearch] = useState('');
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Posts</title>
        <meta name="description" content="These are my posts" />
      </Head>
      <div className={styles.searchPostButtonContainer}>
        <input
          className={styles.searchPostButton}
          placeholder="Search..."
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      <div className={styles.cardContainer}>
        {/* <Grid centered> */}
        <div>
          {props.blogPosts
            .filter((blogPost) => {
              if (search === '') {
                return blogPost;
              } else if (
                blogPost.title.toLowerCase().includes(search.toLowerCase())
              ) {
                return blogPost;
              }
            })

            .map((blogPost) => {
              return (
                <div key={`blogPost-${blogPost.id}`}>
                  <div>
                    <span className={styles.cardTopic}>{blogPost.topic}</span>
                  </div>
                  <Link href={`/blogPosts/${blogPost.id}`} passHref>
                    <Header as="h1">{blogPost.title}</Header>
                  </Link>{' '}
                  <div>Written by {blogPost.username}</div>
                  <Divider />
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // this code is for restriction on pages (the user must be logged in to see or do something)
  // We have to call context in getServerSideProps function as well

  // const sessionToken = context.req.cookies.sessionToken;
  // const session = await getValidSessionByToken(sessionToken);

  // if (!session) {
  //   return {
  //     props: {
  //       error: 'In order to see blog posts, please log in',
  //     },
  //   };
  // }
  const blogPosts = await getBlogPosts();

  console.log('db', blogPosts);

  return {
    props: {
      blogPosts: blogPosts,
    },
  };
}
