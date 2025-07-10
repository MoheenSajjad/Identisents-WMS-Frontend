import React from 'react';
import { useForm } from 'react-hook-form';
import LogoImg from '@/assets/id_logo.png';
import { TextFormField } from '@/components/ui/formField';
import { Button } from '@/components/ui/Button';
import GifTest from '@/assets/setting_asset.gif';

export const Login = () => {
  const { control } = useForm();
  return (
    <div className="h-screen w-full bg-[url('@/assets/login_bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="mx-auto my-auto flex h-full w-96 flex-col items-center justify-center">
        <div className="mb-16">
          <img src={LogoImg} className="w-[180px]" />
        </div>

        <img src={GifTest} className="w-[200px]" />
        <TextFormField
          label="Username"
          name="Username"
          control={control}
          placeholder="Olivia"
          isRequired
          className="mb-5"
        />
        <TextFormField
          label="Password"
          name="password"
          control={control}
          placeholder="******"
          isRequired
        />
        <Button
          className="my-10 w-full"
          variant={Button.Variant.PRIMARY}
          size={Button.Size.DEFAULT}
          type="submit"
        >
          Login
        </Button>
      </div>
    </div>
  );
};
