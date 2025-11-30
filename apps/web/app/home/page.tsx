"use client";
import { PageBody, PageHeader } from '@kit/ui/page';
import Shop from '~/home/shop-landing';


export default function HomePage() {
  return (
    <>
      <PageHeader description={'Your SaaS at a glance'} />

      <PageBody>
      <Shop />
      </PageBody>
    </>
  );
}
