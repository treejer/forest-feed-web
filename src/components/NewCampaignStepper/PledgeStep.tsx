import React, {useCallback, useState} from 'react';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {InputRange} from '@forest-feed/components/kit/InputRange/InputRange';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {Counter} from '@forest-feed/components/NewCampaignStepper/Counter';

export function PledgeStep() {
  const [campaignSize, setCampaignSize] = useState<number>(1);
  const [switches, setSwitches] = useState({
    canCollect: false,
    onlyFollowers: false,
    rewardFollowers: false,
  });

  const handleChangeCampaignSize = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignSize(+e.target.value);
  }, []);

  const handleChangeSwitches = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSwitches({
        ...switches,
        [e.target.name]: !switches[e.target.name],
      });
    },
    [switches],
  );

  return (
    <div>
      <span className="text-lg font-bold">Campaign Size</span>
      <div>
        <span className="font-semibold text-LightWhite text-lg">How man trees do you want to plant?</span>
      </div>
      <InputRange value={campaignSize} onChange={handleChangeCampaignSize} />
      <div className="flex items-start justify-between text-LightWhite">
        <span>1 tree</span>
        <span>1000 trees</span>
      </div>
      <Spacer times={4} />
      <div className="font-bold">
        <span className="text-xl font-bold">Post Settings</span>
      </div>
      <Spacer times={2} />
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="canCollect"
          id="canCollect"
          value={0}
          checked={switches.canCollect}
          onChange={handleChangeSwitches}
        />
        <span className="text-lg">This post can be collected</span>
      </div>
      <Spacer times={2} />
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="onlyFollowers"
          id="onlyFollowers"
          value={0}
          checked={switches.onlyFollowers}
          onChange={handleChangeSwitches}
        />
        <span className="text-lg">This post can be collected Only followers </span>
      </div>
      <Spacer times={4} />
      <div>
        <span className="text-lg font-bold">Reward Filters</span>
      </div>
      <div className="flex items-center">
        <span className="text-LightWhite">Chose the minimum number of followers accounts need to have</span>
        <Spacer times={4} />

        <Counter />
      </div>
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="rewardFollowers"
          id="rewardFollowers"
          value={0}
          checked={switches.rewardFollowers}
          onChange={handleChangeSwitches}
        />
        <span className="text-lg"> Reward only your followers</span>
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text="Back" />
        <Spacer times={2} />
        <Button variant={ButtonVariant.secondary} text="Proceed" />
      </div>
    </div>
  );
}
