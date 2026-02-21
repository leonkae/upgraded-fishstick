"use client";

import React, { useEffect, useState } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share2, ArrowRight, RefreshCw, Heart } from "lucide-react";

const ResultScreen: React.FC = () => {
  const {
    finalResult,
    questions,
    calculateScore,
    resetQuestionnaire,
    userInfo,
    setCurrentStep, // ← ensure this is exposed in your QuestionnaireContext
  } = useQuestionnaire();

  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const compute = () => {
      if (finalResult && Array.isArray(finalResult.responses)) {
        const earned = finalResult.responses.reduce(
          (acc: number, r: any) => acc + (Number(r.score) || 0),
          0
        );

        const maxPossible =
          questions && questions.length > 0
            ? questions.reduce((acc, q) => {
                const maxOpt = q.options.reduce(
                  (m, o) => (o.value > m ? o.value : m),
                  0
                );
                return acc + (maxOpt || 10);
              }, 0)
            : (finalResult.responses.length || 0) * 10;

        const pct = maxPossible > 0 ? (earned / maxPossible) * 100 : 0;
        setScore(pct);
        setLoading(false);
        return;
      }

      const pct = calculateScore();
      setScore(pct);
      setLoading(false);
    };

    compute();
  }, [finalResult, questions, calculateScore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-lg">Loading results...</div>
      </div>
    );
  }

  const getScoreRange = () => {
    if (score >= 75) return "high";
    if (score >= 30) return "medium";
    return "low";
  };

  const scoreRange = getScoreRange();

  const renderFeedback = () => {
    if (scoreRange === "high") {
      return (
        <>
          <p className="text-lg mb-6">
            <span className="font-bold">Glory!!!</span> There is every
            indication that you are on the NARROW WAY headed to Heaven.
            Therefore, do not cast away your confidence which has a great
            reward. Endure to the end and you shall surely spend eternity in
            Heaven. Occupy until Jesus Christ returns.
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 font-serif">
              You must therefore continue to:
            </h3>
            <div className="space-y-2">
              {[
                "Devote more and more time to know God intimately through consistent reading and meditating upon His Word, personal prayer-time and fellowshipping with other believers",
                "Share your faith in Christ Jesus and participate in mentoring other disciples",
                "Be intentional in your church, your family and community in your labor of love with your time, finances and talents",
                "Patiently stand firm, keep His commands and persevere in every persecution, tribulation and trials",
                "Daily pray and ask God to fill you with the Holy Spirit",
                "Make every effort to live at peace with all everyone; easily forgive those who offend you, do not be bitter or hold grudges and resentment",
              ].map((recommendation, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-md flex items-start bg-heaven-secondary/70 text-gray-800"
                >
                  <ArrowRight size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    } else if (scoreRange === "medium") {
      return (
        <>
          <p className="text-lg mb-6">
            <span className="font-bold">There is great Hope for you.</span> Your
            responses DO NOT show clearly whether you are on the NARROW WAY
            leading to Heaven nor on the BROAD WAY headed to Hell. However, as
            long as you are alive, you have time and chance to work diligently
            and make your call and election sure. In eternity there is no middle
            ground. You've got to be either hot or cold. Otherwise, you will end
            up outside with the sorcerers, sexually immoral, murderers,
            idolaters and those who practice and love lies.
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 font-serif">
              Therefore, you must:
            </h3>
            <div className="space-y-2">
              {[
                "Give more earnest heed to the biblical truth you have heard lest you drift away",
                "Not be too comfortable pursuing worldly riches and statuses over and above the eternal kingdom of God",
                "Not be complacent, rather press toward the goal for the prize of the upward call of God in Christ Jesus",
                "Be faithful and you shall receive a crown of life",
              ].map((recommendation, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-md flex items-start bg-amber-100 text-gray-800"
                >
                  <ArrowRight size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 font-serif">
              Encourage yourself to put more emphasis on the following areas:
            </h3>
            <div className="space-y-2">
              {[
                "Establish a consistent pattern for Prayer and Bible study",
                "Live in repentance; if you commit sin, confess it without delay and ask God to forgive and restore you",
                "Prioritize assembling together with other believers in Church services",
                "Give attention to a Discipleship Program [enroll if you haven't yet]",
                "Pray asking for wisdom from God, before making any key decisions including asking for a Pastor specifically for you",
                "Ask God to help you understand your prophetic destiny/divine purpose for which He continues to keep you alive",
                "Patiently stand firm, keep His commands and persevere in every persecution, tribulation, trial, and hardship to the end and you shall be saved",
                "Be open and share areas of your struggles, unbecoming habits and, attitudes and moods swings with a gospel minister whom you trust and allow them stand with you in prayer and sound counsel for your deliverance",
                "Depart from any pastor or Church where you are not taught to develop intimacy with Jesus Christ",
                "Daily pray and ask God to fill you with the Holy Spirit",
                "Make every effort to live at peace with all everyone; easily forgive those who offend you, do not be bitter or hold grudges and resentment",
              ].map((recommendation, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-md flex items-start bg-amber-100 text-gray-800"
                >
                  <ArrowRight size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-xl font-semibold mb-3 font-serif">
              Do you need to repent afresh?
            </h3>
            <p className="mb-4">
              If you are that person who desires to live according to the
              dictates of the Kingdom of God but you always find it difficult to
              do so, it means the law of sin and death is at work in your life.
              You will keep conforming to worldly patterns until you begin your
              journey of transformation by the renewing of your mind with the
              Word of God. You need the Spirit of Christ to give you power to
              overcome sin. Similarly, if you once accepted Jesus Christ as Lord
              and Savior and now you are not sure if you have a relationship
              with Him anymore, you need to know He is a God of a second chance
              and a third and fourth and a fifth etc. Do not let pride prevent
              you from re-connecting with Jesus Christ. Beware, your wealth or
              political status can deceive you into thinking that it is shameful
              for a powerful or prosperous person to submit to the Gospel of
              Jesus Christ. Please repeat the words below prayerfully:
            </p>
            <div className="italic p-4 bg-white rounded border border-amber-300">
              <p className="mb-2">Dear God,</p>
              <p className="mb-2">
                I admit that I am a sinner. Thank you for sending your Son,
                Jesus Christ to die on the Cross and pay for my sin. I forsake
                all my sin and I ask for your forgiveness. Let the Blood of
                Jesus that was shed for the sin of the world cleanse me. I
                commit my life to Jesus as my Lord and Savior. I forgive
                everyone who has hurt or offended me in any way. Save me God and
                help me to be ready to go with Jesus when He comes again. Thank
                you God for your sacrificial love for me.
              </p>
              <p className="mb-2">
                Thank you God for accepting me as your child.
              </p>
              <p>In Jesus Name, Amen.</p>
            </div>
          </div>

          <div className="mb-6">
            <p>
              Get a personal hard copy bible and read daily beginning with the
              book of John.
            </p>
            <p>
              After four - six months re-take this assessment to track your
              progress.
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <p className="text-lg mb-6">
            <span className="font-bold">There is Hope for you.</span> Friend,
            from your responses there is every indication that you are on the
            BROAD WAY headed to Hell. But there is hope for your turnaround. You
            must believe that God Loves you and His thoughts towards you are not
            of evil but to give you a peaceful future and a hope. However, you
            must diligently consider your ways and adjust accordingly so that
            you can obtain salvation and enter Heaven. You may be feeling so
            condemned and far away from God because of your dark and terrible
            sinful past as a murderer, robber, unjust, terrorist, unmerciful,
            selfish, sexually immoral, bitter, committed abominations,
            abortions, atheist, blasphemer, sexual pervert, a sorcerer,
            witch/wizard…… God is so merciful and willing to forgive you.
          </p>

          <div className="mb-6">
            <p className="mb-3">
              Jesus Christ came to restore back the beautiful relationship man
              had with God our Creator. He was born by the virgin Mary on earth
              as a Messiah to save souls of men from sins. He was crucified and
              died, buried and resurrected as the sacrifice that He paid the
              penalty/price for our sins so that we can be reconciled and
              restored back into the relationship humans lost with God.
              Therefore, Jesus Christ is the only name given to men by which we
              must be saved and enter Heaven. He is the Way, the Life and Truth.
            </p>
            <p className="mb-3">
              Let no one deceive you that all religions in the world ultimately
              point to the same Living God. No they don't. By your faith in
              Christ Jesus you are justified. You must recognize that you are a
              sinner that needs God's forgiveness, acknowledge your sins and
              confess and forsake the sinful life and turn back to obeying God.
              Destination of either Heaven or Hell is entirely your choice. It
              is with your heart that you believe and confess with your mouth to
              be saved.
            </p>
            <p>
              If you continue living the way you are, you will end up in HELL.
              You need to change direction today. Repeat along the short prayer
              below and believe in your heart what you say and you shall be
              saved.
            </p>
          </div>

          <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
            <h3 className="text-xl font-semibold mb-3 font-serif">Prayer:</h3>
            <div className="italic p-4 bg-white rounded border border-rose-300">
              <p className="mb-2">Dear God,</p>
              <p className="mb-2">
                I admit that I am a sinner. Thank you for sending your Son,
                Jesus Christ to die on the Cross and pay for my sin. I forsake
                all my sin and I ask for your forgiveness. Let the Blood of
                Jesus that was shed for the sin of the world cleanse me. I
                commit my life to Jesus as my Lord and Savior. I forgive
                everyone who has hurt or offended me in any way. Save me God and
                help me to be ready to go with Jesus when He comes again. Thank
                you God for your sacrificial love for me.
              </p>
              <p className="mb-2">
                Thank you God for accepting me as your child.
              </p>
              <p>In Jesus Name, Amen.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 font-serif">
              If you made the prayer above, you can then:
            </h3>
            <div className="space-y-2">
              {[
                "Get a personal bible and read daily beginning with the book of John",
                "Ask God to direct you to a Pastor who will nurture you and help you to grow in your journey of faith",
                "Visit a church for resources, counsel and support on suitable discipleship programs to help you grow in your faith journey",
                "After four - six months re-take this assessment to track your progress",
              ].map((recommendation, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-md flex items-start bg-rose-100 text-gray-800"
                >
                  <ArrowRight size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }
  };

  const getTitleByScore = () => {
    if (scoreRange === "high")
      return "You are on the NARROW WAY headed to Heaven";
    if (scoreRange === "medium") return "There is great Hope for you";
    return "There is Hope for you";
  };

  const getBgColor = () => {
    if (scoreRange === "high") return "heaven-gradient";
    if (scoreRange === "medium") return "bg-amber-50";
    return "hell-gradient";
  };

  const getBgClass = () => {
    if (scoreRange === "high") return "bg-white/90 text-gray-900";
    if (scoreRange === "medium") return "bg-white/90 text-gray-900";
    return "bg-black/80 text-white";
  };

  const getScoreBgClass = () => {
    if (scoreRange === "high") return "bg-heaven-secondary text-gray-800";
    if (scoreRange === "medium") return "bg-amber-400 text-gray-800";
    return "bg-hell-secondary text-white";
  };

  const getTitleClass = () => {
    if (scoreRange === "high") return "text-heaven-accent";
    if (scoreRange === "medium") return "text-amber-600";
    return "text-hell-accent";
  };

  const getButtonClass = () => {
    if (scoreRange === "high")
      return "bg-heaven-accent text-black hover:bg-yellow-400";
    if (scoreRange === "medium")
      return "bg-amber-500 text-black hover:bg-amber-600";
    return "bg-hell-accent text-white hover:bg-orange-600";
  };

  const handleShare = () => {
    const shareData = {
      title: "My Heaven or Hell Assessment Result",
      text: `I just took the Heaven or Hell questionnaire and scored ${score.toFixed(0)}%! 😇🙏\n\nFind out where your path is leading — take the quiz yourself!`,
      url: window.location.href,
    };

    if (navigator.canShare?.(shareData) || navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.log("Share canceled or failed", err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert(
            "Link copied to clipboard! Paste it anywhere to share your result."
          );
        })
        .catch(() => {
          alert(
            "Couldn't copy link. Please copy this URL manually:\n" +
              window.location.href
          );
        });
    }
  };

  const handleDonate = () => {
    // Add ?from=results so PaymentScreen knows the origin
    const url = new URL(window.location.href);
    url.searchParams.set("from", "results");
    window.history.replaceState({}, "", url.toString());

    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${getBgColor()}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl"
      >
        <div className={`p-8 ${getBgClass()}`}>
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium mb-2">
              Dear {finalResult?.userInfo?.name || userInfo.name || "Friend"}
            </h2>
            <div
              className={`inline-block text-xl font-medium px-4 py-2 rounded-full ${getScoreBgClass()}`}
            >
              Your Score: {score.toFixed(0)}%
            </div>
          </div>

          <h1
            className={`text-3xl font-bold mb-4 text-center font-serif ${getTitleClass()}`}
          >
            {getTitleByScore()}
          </h1>

          {renderFeedback()}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button
              onClick={resetQuestionnaire}
              variant="outline"
              className={`flex items-center gap-2 ${
                scoreRange === "high"
                  ? "bg-white text-gray-800 hover:bg-gray-100"
                  : scoreRange === "medium"
                    ? "bg-white text-gray-800 hover:bg-gray-100"
                    : "bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
              }`}
            >
              <RefreshCw size={16} /> Take Again
            </Button>

            <Button
              onClick={handleShare}
              className={`flex items-center gap-2 ${getButtonClass()} w-fit`}
            >
              <Share2 size={16} /> Share Result
            </Button>

            <Button
              onClick={handleDonate}
              className={`flex items-center gap-2 ${getButtonClass()} w-fit border-2 border-current/30 hover:border-current/50`}
            >
              <Heart size={16} /> Support This Ministry
            </Button>
          </div>

          <p className="text-center text-sm mt-8 opacity-80 text-gray-600">
            This assessment is offered freely as a ministry tool.
            <br />
            If it has blessed you, your support helps us reach more souls.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export { ResultScreen };
