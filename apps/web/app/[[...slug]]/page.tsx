import { mock } from '../../config/mock'
import {PageRenderer} from "@dnd-editor/core/src";
import {config} from "../../config/dnd-editor.config";

export const revalidate = 60;

type Params = Promise<{ slug: string[] }>;

export async function generateStaticParams() {

  return mock.map((p) => ({ slug: p.slug.split('/').filter((p) => !!p) }));
}

export default async function Page(props: { params: Params }) {
  const { slug } = await props.params;

  const fullRoute = `/${slug?.join('/') ?? ''}`;
  const page = mock.find(item => item.slug === fullRoute);

  const content = (page?.data || { blocks: [] });


  return <PageRenderer config={config} data={content} />;
}
