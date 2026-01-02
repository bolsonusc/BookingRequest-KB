import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo } from "react";

export type DocSearchItem = {
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  slug: string;
  type: "doc" | "service";
};

interface Props {
  searchList: DocSearchItem[];
}

interface SearchResult {
  item: DocSearchItem;
  refIndex: number;
}

export default function DocSearch({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "docs" | "services">("all");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description", "category", "categoryLabel"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.4,
      }),
    [searchList]
  );

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          searchStr?.length || 0;
      }
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];

    // Apply filter
    if (filter !== "all") {
      const filterType = filter === "docs" ? "doc" : "service";
      inputResult = inputResult.filter(r => r.item.type === filterType);
    }

    setSearchResults(inputResult);

    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal, filter]);

  const getItemUrl = (item: DocSearchItem) => {
    if (item.type === "service") {
      return "/services/";
    }
    return `/docs/${item.slug}/`;
  };

  return (
    <div className="search-container">
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-75">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <span className="sr-only">Search</span>
        </span>
        <input
          className="search-input block w-full rounded-xl border border-skin-line
          bg-skin-fill py-4 pl-12 pr-4 text-lg
          placeholder:text-skin-base placeholder:opacity-50
          focus:border-skin-accent focus:outline-none"
          placeholder="Search documentation..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-sm opacity-50 sm:flex">
          <kbd className="rounded border border-skin-line px-2 py-0.5">
            Ctrl
          </kbd>
          <span className="mx-1">+</span>
          <kbd className="rounded border border-skin-line px-2 py-0.5">K</kbd>
        </span>
      </label>

      {/* Filter buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-skin-accent text-skin-inverted"
              : "bg-skin-card text-skin-base hover:bg-skin-card-muted"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("docs")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === "docs"
              ? "bg-skin-accent text-skin-inverted"
              : "bg-skin-card text-skin-base hover:bg-skin-card-muted"
          }`}
        >
          Documentation
        </button>
        <button
          onClick={() => setFilter("services")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === "services"
              ? "bg-skin-accent text-skin-inverted"
              : "bg-skin-card text-skin-base hover:bg-skin-card-muted"
          }`}
        >
          Services
        </button>
      </div>

      {inputVal.length > 1 && (
        <div className="mt-6 text-sm opacity-70">
          Found {searchResults?.length}
          {searchResults?.length === 1 ? " result" : " results"} for "{inputVal}
          "
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <li key={`${refIndex}-${item.slug}`}>
              <a
                href={getItemUrl(item)}
                className="block rounded-lg border border-skin-line p-4 transition-all hover:border-skin-accent hover:bg-skin-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.type === "doc" ? "doc-badge" : "service-badge"
                        }`}
                      >
                        {item.type === "doc" ? "Doc" : "Service"}
                      </span>
                      <span className="text-xs opacity-60">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h3 className="font-semibold text-skin-base">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm opacity-70">
                      {item.description}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 opacity-50"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </a>
            </li>
          ))}
      </ul>

      {searchResults && searchResults.length === 0 && inputVal.length > 1 && (
        <div className="mt-8 text-center">
          <p className="text-lg opacity-70">No results found</p>
          <p className="mt-2 text-sm opacity-50">
            Try different keywords or browse our documentation
          </p>
        </div>
      )}
    </div>
  );
}
