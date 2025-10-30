"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
export default function SearchBox({
  placeholder = "Search medicines",
  onSelect,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const debounceRef = useRef(null);
  const abortCtrlRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // fetch suggestions
  const fetchSuggestions = useCallback(async (q) => {
    const trimmed = (q || "").trim();
    if (!trimmed) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // abort previous
    if (abortCtrlRef.current) abortCtrlRef.current.abort();
    abortCtrlRef.current = new AbortController();
    setLoading(true);

    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(trimmed)}`,
        {
          signal: abortCtrlRef.current.signal,
        }
      );

      if (!res.ok) {
        // treat non-200 as no-results (you can customize)
        setSuggestions([]);
        setOpen(false);
        return;
      }

      const data = await res.json();
      // if your API returns { error } handle it accordingly
      const list = Array.isArray(data) ? data : data.rows || [];
      setSuggestions(list);
      setOpen(true);
      setHighlightIndex(-1);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Search fetch error:", err);
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce: only call search after user stops typing for 500ms
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // clear any pending timeout
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // wait 500ms after the last keystroke before firing the request
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    // cleanup on re-render or unmount
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  // keyboard navigation
  function onKeyDown(e) {
    if (!open) {
      if (e.key === "ArrowDown" && suggestions.length) setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
      scrollIntoView(highlightIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      scrollIntoView(highlightIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = suggestions[highlightIndex] ?? suggestions[0];
      if (chosen) choose(chosen);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function scrollIntoView(idx) {
    const ul = listRef.current;
    if (!ul) return;
    const el = ul.querySelector(`[data-index="${idx}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  function choose(s, id) {
    router.push(`/products/${id}`);
    setQuery("");
    setSuggestions([]);
  }

  // click outside to close
  useEffect(() => {
    function onDocClick(e) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="relative max-w-200 w-100" ref={inputRef}>
      <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-listbox"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {open && (
        <ul
          id="search-listbox"
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 mt-2 max-h-56 overflow-auto bg-white border rounded-md shadow-lg z-50"
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-slate-500">Loading…</li>
          )}

          {!loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">No results</li>
          )}

          {!loading &&
            suggestions.map((s, idx) => {
              const text = s.name ?? s;
              const isHighlighted = idx === highlightIndex;
              return (
                <li
                  key={s.id ?? text + idx}
                  data-index={idx}
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  onMouseDown={() => choose(s, s.id)}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    isHighlighted ? "bg-emerald-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{text}</span>
                    {s.category && (
                      <span className="text-xs text-slate-400">
                        {s.category}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
