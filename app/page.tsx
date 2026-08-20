"use client";

import { useEffect, useState } from "react";
import { useOmd } from "../lib/useOmd";
import { OMD_ADDR, DEGEN_ADDR, OMD_ABI, ERC20_ABI, LIVE } from "../lib/omd";
import { useWriteContract, useSwitchChain } from "wagmi";
import { parseEther, formatUnits } from "viem";

const HERO_IMGS = ["/degen_777777.png", "/degen_424242.png", "/degen_1337.png", "/degen_15.png", "/degen_28.png", "/degen_41.png", "/degen_7.png"];
const GALLERY = ["/degen_12.png", "/degen_25.png", "/degen_14.png", "/degen_15.png", "/degen_28.png", "/degen_41.png", "/degen_18.png", "/degen_31.png", "/degen_20.png", "/degen_21.png", "/degen_22.png", "/degen_35.png"];
const PRICE_TOKEN = "5000";
const SUPPLY = 1_000_000;

const TICKER = ["ONE MILLION DEGENS", "YES BURN", "WEN MINT?", "NO UTILITY", "NO WL", "WEN LAMBO?", "9x9 PIXELS"];

const RARITY = [
  ["WHALE", "1", "~2,762"],
  ["RUGGER", "2", "~5,525"],
  ["SCAMMER", "3", "~8,287"],
  ["GIGACHAD", "4", "~11,050"],
  ["DIAMOND", "5", "~13,812"],
  ["LIQUIDATED", "6", "~16,575"],
  ["MOONER", "7", "~19,337"],
  ["PAPERHANDS", "8", "~22,099"],
  ["GAMBLER", "9", "~24,862"],
  ["YOLO", "10", "~27,624"],
  ["FEE", "11", "~30,387"],
  ["GM", "12", "~33,149"],
];

const MAX_TX = 100;

export default function Page() {
  const { address, connect, connectors, minted, burned, mintPrice, tokenPrice, allow } = useOmd();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const displayAddress = mounted ? address : undefined;
  const [heroIdx, setHeroIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [pay, setPay] = useState<"eth" | "token">("eth");
  const [msg, setMsg] = useState("");
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((v) => (v + 1) % HERO_IMGS.length), 900);
    return () => clearInterval(t);
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 56, behavior: "smooth" });
  };

  const mintedNum = minted !== undefined ? Number(minted) : 0;
  const maxQty = Math.min(MAX_TX, SUPPLY - mintedNum);
  const priceEth = mintPrice !== undefined ? Number(formatUnits(mintPrice as bigint, 18)) : 0;
  const tokenPriceNum = tokenPrice !== undefined ? Number(formatUnits(tokenPrice as bigint, 18)) : Number(PRICE_TOKEN);
  const total = pay === "eth"
    ? (priceEth > 0 ? (priceEth * qty).toFixed(5) + " ETH" : "FREE")
    : (tokenPriceNum * qty).toLocaleString("en-US") + " $DEGEN";

  const doConnect = async () => {
    try {
      connect({ connector: connectors[0] });
      setMsg("CONNECT YOUR WALLET.");
    } catch { setMsg("NO WALLET FOUND."); }
    try { await switchChainAsync({ chainId: 4663 }); } catch { /* already on chain */ }
  };

  const mintNow = async () => {
    if (!address) { await doConnect(); return; }
    setMsg("");
    try { await switchChainAsync({ chainId: 4663 }); }
    catch { setMsg("SWITCH TO ROBINHOOD CHAIN."); return; }
    try {
      if (pay === "eth") {
        await writeContractAsync({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "mint", args: [BigInt(qty)], value: parseEther((priceEth * qty).toString()) });
        setMsg("MINTED " + qty + " DEGENS. WELCOME TO THE GREEN.");
      } else {
        const need = (tokenPrice as bigint ?? BigInt(0)) * BigInt(qty);
        if ((allow as bigint ?? BigInt(0)) < need) {
          setMsg("APPROVING $DEGEN...");
          await writeContractAsync({ address: DEGEN_ADDR as `0x${string}`, abi: ERC20_ABI, functionName: "approve", args: [OMD_ADDR as `0x${string}`, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")] });
          setMsg("APPROVED. MINTING...");
        }
        await writeContractAsync({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "mintWithToken", args: [BigInt(qty)] });
        setMsg(qty + " DEGENS MINTED. TOKENS BURNED.");
      }
    } catch (e) {
      setMsg("MINT FAILED: " + String((e as { message?: string })?.message || e).slice(0, 60));
    }
  };

  return (
    <>
      <nav>
        <div className="nav-top">
          <div className="logo" onClick={() => goTo("hero")} style={{ cursor: "pointer" }}>
            <div className="logo-pix"><img src="/degen_7.png" alt="" /></div>
            <div>OM DEGENS</div>
          </div>
          <div className="nav-icons">
            <a title="X" href="https://x.com/OneMilliondegen" target="_blank" rel="noopener"><img src="/x_logo.jpg" alt="X" style={{ width: 18, height: 18, verticalAlign: "middle", borderRadius: 4 }} /></a>
            <a title="OPENSEA" href="https://opensea.io/collection/one-million-degens" target="_blank" rel="noopener"><img src="/opensea.png" alt="OPENSEA" style={{ width: 18, height: 18, verticalAlign: "middle" }} /></a>
            <div className="nav-conn">
              {displayAddress ? (
                <span className="wallet-chip" onClick={() => goTo("mintsection")} style={{ cursor: "pointer" }}>{displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}</span>
              ) : (
                <button className="connect-btn" onClick={doConnect}>CONNECT WALLET</button>
              )}
            </div>
          </div>
        </div>
        <div className="links">
          <a onClick={() => goTo("mintsection")}>MINT</a>
          <a onClick={() => goTo("gallery")}>CHARACTERS</a>
          <a onClick={() => goTo("rarity")}>RARITY</a>
          <a onClick={() => goTo("story")}>STORY</a>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-in">
          <h1 className="big">ONE<br />MILLION<br /><span className="g">DEGENS</span></h1>
          <p className="sub">WEN MINT? WEN BURN? WEN LAMBO?</p>
          <div className="hero-img">
            <img src={HERO_IMGS[heroIdx]} alt="degens" />
            <div className="hero-tag">9x9 PIXEL</div>
          </div>
          <button className="coin-btn" onClick={() => goTo("mintsection")}>
            <span className="coin-blink">▸</span> MINT IS LIVE <span className="coin-blink">▸</span>
          </button>
          <div className="hero-stats">
            <div className="hstat"><div className="l">SUPPLY</div><div className="v">1,000,000</div></div>
            <div className="hstat"><div className="l">MINTED</div><div className="v">{minted !== undefined ? minted.toString() : "0"}</div></div>
            <div className="hstat"><div className="l">MINT PRICE</div><div className="v">{priceEth > 0 ? priceEth.toFixed(5) + " ETH" : "FREE"}</div></div>
          </div>
          <div className="scroll-hint">PRESS DOWN TO START ▾</div>
        </div>
      </section>

      <section id="mintsection" className="screen-mint" style={{ borderTop: "6px solid var(--ink)" }}>
        <div className="wrap">
          <div className="scores">
            <div className="score"><div className="l">SCORE // MINTED</div><div className="v">{minted !== undefined ? minted.toString() : "0"} <em>/ 1,000,000</em></div></div>
            <div className="score burn"><div className="l">SCORE // $DEGEN BURNED</div><div className="v">{burned !== undefined ? Number(formatUnits(burned as bigint, 18)).toLocaleString("en-US") : "0"}</div></div>
          </div>

          <div className="mint-grid">
            <div className="machine">
              <div className="machine-top">
                <div className="machine-title">DEGEN MACHINE <span className="online">■ ONLINE</span></div>
                <div className="machine-img">
                  <img src={HERO_IMGS[heroIdx]} alt="" />
                </div>
                <div className="machine-sub">RANDOM DEGEN · TOKEN 1-1,000,000</div>
              </div>

              <div className="qty-row">
                <button className="qty-btn" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button>
                <input className="qty-num" type="number" min={1} max={maxQty} value={qty}
                  onChange={(e) => {
                    const v = Math.floor(Number(e.target.value));
                    setQty(isNaN(v) || v < 1 ? 1 : Math.min(v, maxQty));
                  }}
                /><small className="qty-max">MAX {maxQty} PER MINT</small>
                <button className="qty-btn" disabled={qty >= maxQty} onClick={() => setQty(qty + 1)}>+</button>
                <button className="qty-btn" style={{ width: 56, fontSize: 12 }} onClick={() => setQty(maxQty)}>MAX</button>
              </div>

              <div className="pay-row">
                <button className={"pay-btn" + (pay === "eth" ? " on" : "")} onClick={() => setPay("eth")}>PAY ETH</button>
                <button className={"pay-btn" + (pay === "token" ? " on" : "")} onClick={() => setPay("token")}>PAY $DEGEN</button>
              </div>

              <div className="total">{total}<small>TOTAL · ONE TX · ALL AT ONCE</small></div>

              <button className="mint-btn" disabled={!LIVE} onClick={mintNow}>
                {!LIVE ? "GAME NOT STARTED" : displayAddress ? "MINT NOW ▸" : "CONNECT WALLET"}
              </button>

              <p className="msg">{msg}</p>

              <a href="https://opensea.io/collection/one-million-degens" target="_blank" rel="noopener" className="os-link">VIEW ON OPENSEA ▸</a>
            </div>

            <div className="side">
              <div className="burn-box">
                <div className="t">MINT WITH $DEGEN = BURN</div>
                <div className="b">5,000 $DEGEN → 0xdEaD</div>
                <p>Every $DEGEN used for minting goes straight to <code>0x0000...dEaD</code>, burned forever. ETH mints don't burn anything; the ETH goes to the treasury.</p>
              </div>

              <div className="limit-box">
                <div className="t">$DEGEN TOKEN CA</div>
                <div className="ca">0x9e76886e9e6BCc808472151Cb99F9919e237997f</div>
                <div className="ca-sep"></div>
                <div className="t" style={{ marginTop: 10 }}>OPENSEA</div>
                <a href="https://opensea.io/collection/one-million-degens" target="_blank" rel="noopener" style={{ cursor: "pointer", textDecoration: "none", color: "var(--green)", fontWeight: 900, letterSpacing: 2, fontSize: 12 }}>COLLECTION PAGE ▸</a>
                <p style={{ marginTop: 8, opacity: 0.6 }}>MINT BY BURNING $DEGEN.</p>
              </div>

              <div className="limit-box">
                <div className="t">THE GREEN RULES</div>
                <div className="rules">NO WL · NO UTILITY · NO TG · NO DC<br /><b>YES BURN.</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="gallery" className="wrap">
        <h2 className="sec-title">CHARACTERS</h2>
        <div className="grid">
          {GALLERY.map((g) => (
            <div className="g-item" key={g}><img src={g} alt="degen" /></div>
          ))}
        </div>
      </section>

      <section id="rarity" className="wrap">
        <h2 className="sec-title">NAME RARITY</h2>
        <table className="rare">
          <tbody>
            <tr><th>NAME</th><th>WEIGHT</th><th>EST. IN 1M</th></tr>
            {RARITY.map(([n, w, e]) => (
              <tr key={n}><td>{n}</td><td>{w}</td><td>{e}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="story" className="wrap">
        <h2 className="sec-title">STORY</h2>
        <div className="story-txt">
          <p>
            One pen. One green. <b>One million faces.</b><br />
            The first and only <b>1,000,000 NFT</b> collection on <b>Robinhood Chain</b>.<br />
            No utility. No whitelist. No TG. No DC. <b>No forced royalty.</b><br />
            <b>YES $DEGEN BURN.</b><br />
            Every degen is a single <b>9x9 pixel</b>, stamped black on the green ledger.<br />
            No roadmaps. No promises.<br />
            The degens control everything. <b>ONE MILLION DEGENS.</b>
          </p>
        </div>
      </section>

      <footer>
        <span>OM DEGENS · 1,000,000 ON ROBINHOOD CHAIN</span>
        <span className="footer-r">NOT FINANCIAL ADVICE · DEGENS CONTROL EVERYTHING</span>
      </footer>
    </>
  );
}