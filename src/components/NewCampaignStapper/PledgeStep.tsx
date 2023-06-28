import React from 'react';
import {Stepper} from '../kit/Stepper';
import {Button, ButtonVariant} from '../kit/Button';
import {InputRange} from '../kit/InputRange/InputRnge';
import {Spacer} from '../kit/Spacer';
import {Switch} from '../kit/Switch/Switch';
import {Counter} from './Counter';

export function PledgeStep() {
  return (
    <div>
      <span className="text-lg font-bold">Campaign Size</span>
      <div>
        <span className="font-semibold text-LightWhite text-lg">How man trees do you want to plant?</span>
      </div>
      <InputRange />
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
        <Switch />
        <span className="text-lg">This post can be collected</span>
      </div>
      <Spacer times={2} />
      <div className="flex items-center">
        <Switch />
        <span className="text-lg">This post can be collected Only followers </span>
      </div>
      <Spacer times={4} />
      <div>
        <span className="text-lg font-bold">Reward Filters</span>
      </div>
      <div className="flex items-center ">
        <span className="text-LightWhite ">Chose the minimum number of followers accounts need to have</span>
        <Spacer times={4} />

        <Counter />
      </div>
      <div className="flex items-center">
        <Switch />
        <span className="text-lg"> Reward only your followers</span>
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text="Back" />
        <Spacer times={2} />
        <Button variant={ButtonVariant.secondary} text="Procced" />
      </div>
    </div>
  );
}
