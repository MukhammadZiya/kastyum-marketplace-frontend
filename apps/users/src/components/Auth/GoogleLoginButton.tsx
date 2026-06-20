import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: () => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  function handleSuccess(response: CredentialResponse) {
    if (response.credential) {
      onSuccess(response.credential);
    }
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={onError}
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
        text="continue_with"
      />
    </div>
  );
}
