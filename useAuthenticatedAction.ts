import { setOnAfterAuthCallback, useGlobalStore } from '@store/global';

type AuthenticatedAction = (...args: any[]) => void;

export const useAuthenticatedAction = () => {
  const signUpModalRef = useGlobalStore(state => state.signUpModalRef);
  const isAuth = useGlobalStore(state => !!state.user);

  const withAuthCheck = <T>(action: AuthenticatedAction) => {
    return (params: T) => {
      const wrappedAction = () => action(params);

      if (!isAuth) {
        signUpModalRef?.current?.open();
        setOnAfterAuthCallback(wrappedAction);
        return;
      }

      wrappedAction();
    };
  };

  return { withAuthCheck };
};

// usage
const { withAuthCheck } = useAuthenticatedAction();
const onPressSomeBtn = withAuthCheck<void>(async () => {
  // do something
});
