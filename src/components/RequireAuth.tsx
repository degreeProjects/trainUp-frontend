import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import userStore from "../common/store/user.store";
import usersService from "../services/userService";

interface Props {
  children: React.ReactNode;
}

const RequireAuth = observer(({ children }: Props) => {
  const { user, setUser } = userStore;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chose not to use "cancel" for this function because when running vite on dev environment it aborts
    const { request } = usersService.getMe();

    request
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setUser]);

  return (
    !loading && (user ? children : <Navigate to="/login" replace={true} />)
  );
});

export default RequireAuth;
