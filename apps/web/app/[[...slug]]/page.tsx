import { mock } from '../../config/mock'
import { trimConfig } from "@dnd-editor/core";
import { PageRenderer } from "@dnd-editor/core/renderer";

export const revalidate = 60;

type Params = Promise<{ slug: string[] }>;

export async function generateStaticParams() {

  return mock.map((p) => ({ slug: p.slug.split('/').filter((p) => !!p) }));
}

export default async function Page(props: { params: Params }) {
  const { slug } = await props.params;

  const fullRoute = `/${slug?.join('/') ?? ''}`;
  const page = mock.find(item => item.slug === fullRoute);
  const { config } = await import("../../config/dnd-editor.config")
  const content = (page?.data || { blocks: [] });
  const trimmedConfig = trimConfig(config, content.blocks);

  return <PageRenderer config={trimmedConfig} data={content} />;
}
