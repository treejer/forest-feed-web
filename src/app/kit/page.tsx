import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {TextArea} from '@forest-feed/components/kit/TextArea';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Spacer} from '@forest-feed/components/common/Spacer';

function KitPage() {
  return (
    <div>
      <h1>This is Kit Page</h1>
      <Button text="Learn More" />
      <Button variant={ButtonVariant.secondary} text="proceed" />
      <Button variant={ButtonVariant.menu} text="nemidonm" />
      <Button variant={ButtonVariant.text} text="nemidonm" />

      <TextArea label="Content" placeholder="Write your post here..." />

      <Uploader />
      <Spacer />
    </div>
  );
}

export default KitPage;
