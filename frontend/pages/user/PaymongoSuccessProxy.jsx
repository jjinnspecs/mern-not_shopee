import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymongoSuccessProxy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("PayMongo Proxy URL:", window.location.href);
    const sourceId = searchParams.get("source");
    if (sourceId) {
      navigate(`/success?source_id=${sourceId}`, { replace: true });
    } else {
      navigate("/error", { replace: true });
    }
  }, [navigate, searchParams]);

  return null;
};

export default PaymongoSuccessProxy;
