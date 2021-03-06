import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

// Define props
type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
};

export default function CreateBlogPost(props: Props) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [topic, setTopic] = useState('');

  const router = useRouter();

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Create a Blog Post</title>
        <meta name="description" content="Create a blog post" />
      </Head>
      <div className={styles.createPostContainer}>
        {/* <h1>Create a blog post</h1> */}
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch('/api/blogPosts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                blogPost: {
                  username: props.userObject.username,
                  title: title,
                  story: story,
                  topic: topic,
                },
              }),
            });

            props.refreshUserProfile();
            await router.push('/posts');
          }}
        >
          <Form.Field>
            <label>
              <input
                value={title}
                placeholder="Title"
                onChange={(event) => setTitle(event.currentTarget.value)}
              />
            </label>
          </Form.Field>

          <Form.TextArea
            style={{ minHeight: 200 }}
            value={story}
            placeholder="Write your story"
            onChange={(event) => setStory(event.currentTarget.value)}
          />
          <Form.Field>
            <label>
              <input
                value={topic}
                placeholder="Write your topic"
                onChange={(event) => setTopic(event.currentTarget.value)}
              />
            </label>
          </Form.Field>

          <Button inverted color="violet">
            Create a Post
          </Button>
        </Form>
      </div>
    </Layout>
  );
}
