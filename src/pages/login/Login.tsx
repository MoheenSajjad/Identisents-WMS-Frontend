import { useForm } from 'react-hook-form';
import LogoImg from '@/assets/id_logo.png';
import { PasswordFormField, TextFormField } from '@/components/ui/formField';
import { Button } from '@/components/ui/Button';
import z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Form } from '@/components/ui/form';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const Login = () => {
  const { login, isLoading, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const SubmitData = async (data: any) => {
    try {
      loginSchema.parse(data);
      const response = await login(data.username, data.password);
      console.log(response);

      reset();
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <div className="h-screen w-full bg-[url('@/assets/login_bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="mx-auto my-auto flex h-full w-96 flex-col items-center justify-center">
        <div className="mb-16">
          <img src={LogoImg} className="w-[180px]" />
        </div>

        <Form onSubmit={handleSubmit(SubmitData)}>
          <TextFormField
            label="Username"
            name="username"
            control={control}
            placeholder="username"
            hasError={control.getFieldState('username').invalid}
            isDisabled={isLoading}
            isRequired
            className="mb-3"
          />
          <PasswordFormField
            label="Password"
            name="password"
            control={control}
            placeholder="password"
            hasError={control.getFieldState('password').invalid}
            isDisabled={isLoading}
            isRequired
          />

          <Button
            variant={Button.Variant.PRIMARY}
            className="my-5 w-full"
            type="submit"
            loading={isLoading}
          >
            LOGIN
          </Button>
        </Form>
      </div>
    </div>
  );
};
