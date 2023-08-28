import Content from '../mockContent';

export default function Page(props: any) {
  return <>
    <h2>Star Growth</h2>
    <Content title="Star Growth" nextLink='engagement' prevLink='overview' />
  </>
}