import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import {
  useUserById,
  useInfiniteScroll,
  useInfinitePosts,
} from "../../../hooks";
import { POSTS_LIMIT } from "../../../utils/globals";
import { type RouterInputs } from "../../../utils/trpc";
import { type DehydratedState } from "@tanstack/react-query";
import LoadingPage from "../../LoadingPage";
import { withProfileId, withProfilePaths } from "../../../hoc";

type UsersPostsPageProps = { trpcState: DehydratedState; profileId: string };

const UsersPostsPage: NextPage<UsersPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { profileId } = props;

  const inputData: RouterInputs["post"]["infinitePosts"] = {
    where: {
      creator: {
        id: profileId,
      },
    },
    limit: POSTS_LIMIT,
  };

  const { data: session, status } = useSession();
  const { data: foundUser, isLoading } = useUserById({ userId: profileId });

  const { data, hasNextPage, fetchNextPage } = useInfinitePosts({
    input: inputData,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  if (status === "loading" || isLoading || !data) {
    return <LoadingPage />;
  }

  const usersPosts = data.pages.flatMap((page) => page.posts) ?? [];

  const profilePosts =
    session?.user?.id === profileId ? "My posts" : `${foundUser?.name}'s posts`;

  return (
    <Layout title={profilePosts}>
      <PageHeading>{profilePosts}</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={usersPosts} input={inputData} />
      </section>
    </Layout>
  );
};

export default UsersPostsPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
