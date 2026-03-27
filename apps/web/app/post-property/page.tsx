import { Button, Card, CardContent, CardGrid, CardHeader, CardTitle, Checkbox, Input, Select } from "@property-lk/ui";
import { PageShell } from "../../components/layout/page-shell";
import { PostPropertyDialog } from "../../components/post-property/post-property-dialog";
import { SectionHeading } from "../../components/ui/section-heading";
import { listingTypeOptions, propertyTypeOptions } from "../../lib/site-data";

export default function PostPropertyPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Post property"
        title="Start a listing"
        description="This can later become a guided listing creation flow with validation and uploads."
      />
      <Card className="panel">
        <CardHeader>
          <CardTitle>Listing starter form</CardTitle>
        </CardHeader>
        <CardContent className="search-form-grid">
          <Input hint="This shell is for layout only." label="Listing title" placeholder="Three-bedroom apartment in Colombo 07" />
          <Select label="Listing type" options={listingTypeOptions} placeholder="Select type" />
          <Select label="Property type" options={propertyTypeOptions} placeholder="Select property" />
          <Input label="Area" placeholder="Rajagiriya" />
          <Checkbox
            description="Reserved for moderation and trust logic."
            label="Highlight as verified submission"
          />
          <Button disabled>Submit later</Button>
        </CardContent>
      </Card>
      <CardGrid>
        <PostPropertyDialog />
      </CardGrid>
    </PageShell>
  );
}
