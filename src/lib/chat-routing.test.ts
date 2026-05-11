import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import { isResumeQuery, lastUserText } from "./chat-routing";

function userMsg(text: string): UIMessage {
  return {
    id: "u1",
    role: "user",
    parts: [{ type: "text", text }],
  } as UIMessage;
}

function assistantMsg(text: string): UIMessage {
  return {
    id: "a1",
    role: "assistant",
    parts: [{ type: "text", text }],
  } as UIMessage;
}

describe("lastUserText", () => {
  it("returns empty string for no messages", () => {
    expect(lastUserText([])).toBe("");
  });

  it("returns empty string when only assistant messages exist", () => {
    expect(lastUserText([assistantMsg("Hello")])).toBe("");
  });

  it("returns the most recent user message lowercased", () => {
    expect(lastUserText([userMsg("Tell me about RESUMES")])).toBe(
      "tell me about resumes",
    );
  });

  it("returns the last user message, not the first, when both roles interleave", () => {
    expect(
      lastUserText([
        userMsg("first question"),
        assistantMsg("first answer"),
        userMsg("Can I see your resume?"),
      ]),
    ).toBe("can i see your resume?");
  });

  it("concatenates multi-part text within a single user message", () => {
    const m: UIMessage = {
      id: "u1",
      role: "user",
      parts: [
        { type: "text", text: "do you" },
        { type: "text", text: "have a CV?" },
      ],
    } as UIMessage;
    expect(lastUserText([m])).toBe("do you have a cv?");
  });
});

describe("isResumeQuery", () => {
  it("matches the canonical preset prompt", () => {
    expect(isResumeQuery([userMsg("Can I see your resume?")])).toBe(true);
  });

  it("matches mid-sentence resume mentions", () => {
    expect(isResumeQuery([userMsg("do you have a resume i can look at")])).toBe(
      true,
    );
  });

  it("matches CV", () => {
    expect(isResumeQuery([userMsg("got a CV?")])).toBe(true);
  });

  it("matches work history", () => {
    expect(isResumeQuery([userMsg("walk me through your work history")])).toBe(
      true,
    );
  });

  it("matches curriculum vitae", () => {
    expect(isResumeQuery([userMsg("Curriculum Vitae please")])).toBe(true);
  });

  it("does NOT match unrelated questions", () => {
    expect(isResumeQuery([userMsg("show me your projects")])).toBe(false);
    expect(isResumeQuery([userMsg("what is this position-addressed thingy?")]))
      .toBe(false);
    expect(isResumeQuery([userMsg("walk me through your AI workflow")])).toBe(
      false,
    );
  });

  it("does NOT false-trigger on partial-word matches", () => {
    // "presume" contains "esume" but not the whole word "resume".
    expect(isResumeQuery([userMsg("i presume you write code")])).toBe(false);
  });

  it("returns false when no user message exists", () => {
    expect(isResumeQuery([])).toBe(false);
    expect(isResumeQuery([assistantMsg("Hello")])).toBe(false);
  });

  it("uses the most recent user message, not earlier turns", () => {
    expect(
      isResumeQuery([
        userMsg("can I see your resume?"),
        assistantMsg("yes, here you go"),
        userMsg("now tell me about your projects"),
      ]),
    ).toBe(false);
  });
});
