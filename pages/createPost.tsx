import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { RegisterResponseBody } from './api/register';

// Define props
type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
  cloudinaryAPI: string;
};

export default function CreateBlogPost(props: Props) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'my-uploads');
    setLoading(true);
    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/${props.cloudinaryAPI}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setImage(file.secure_url);
    setLoading(false);
  };

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
            await fetch('/api/createPost', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title,
                story: story,
                image: image,
              }),
            });

            props.refreshUserProfile();
            await router.push('/');
          }}
        >
          <Form.Field>
            <label>
              <input
                value={title}
                placeholder="Enter title"
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
          <div>
            <label htmlFor="picture">Image</label>
            <input
              id="file"
              type="file"
              required
              placeholder="Upload an image"
              onChange={uploadImage}
            />
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <img src={image} className="mt-4" alt="upload" />
              )}
            </div>
          </div>

          <Button inverted color="violet">
            Create a Post
          </Button>
        </Form>
      </div>
    </Layout>
  );
}

export function getServerSideProps() {
  // Redirect from HTTP to HTTPS on Heroku

  const cloudinaryAPI = process.env.CLOUDINARY_KEY;

  // 3. otherwise render the page
  return {
    props: {
      cloudinaryAPI,
    },
  };
}
