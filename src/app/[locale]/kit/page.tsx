'use client';

import {useState} from 'react';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {TextArea} from '@forest-feed/components/kit/TextArea';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Spacer} from '@forest-feed/components/common/Spacer';

function KitPage() {
  const [text, setText] = useState('');

  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <h1>This is Kit Page</h1>
      <Button text="Learn More" />
      <Button variant={ButtonVariant.secondary} text="proceed" />
      <Button variant={ButtonVariant.menu} text="nemidonm" />
      <Button variant={ButtonVariant.text} text="nemidonm" />

      <TextArea
        value={text}
        onChange={e => setText(e.target.value)}
        label="Content"
        placeholder="Write your post here..."
      />

      <Uploader preview file={file} onChange={e => setFile(e.target?.files?.[0] || null)} />
      <Spacer />
    </div>
  );
}

export default KitPage;
