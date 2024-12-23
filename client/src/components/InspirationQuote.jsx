import React from "react";
import { useQuote } from "../hooks/useQuote";

const InspirationQuote = () => {
  const { quote, loading, error, refresh } = useQuote();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>获取名言失败</div>;
  if (!quote) return null;

  return (
    <div className="quote-container">
      <p className="quote-content">{quote.content}</p>
      {quote.author && <p className="quote-author">—— {quote.author}</p>}
      <button onClick={refresh}>换一条</button>
    </div>
  );
};

export default InspirationQuote;
