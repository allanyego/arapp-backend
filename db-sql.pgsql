--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 11.6 (Ubuntu 11.6-1.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: guides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guides (
    id integer NOT NULL,
    active boolean NOT NULL,
    title character varying NOT NULL,
    body text NOT NULL,
    links text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.guides OWNER TO postgres;

--
-- Name: guides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.guides_id_seq OWNER TO postgres;

--
-- Name: guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guides_id_seq OWNED BY public.guides.id;


--
-- Name: guides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guides ALTER COLUMN id SET DEFAULT nextval('public.guides_id_seq'::regclass);


--
-- Data for Name: guides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.guides (id, active, title, body, links, created_at) FROM stdin;
1	t	test guide	This is one awesome guide my dude, you should use it more often my dude,\nwooot woot	layers, https://me.you	2021-03-18 16:03:36.643+03
\.


--
-- Name: guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.guides_id_seq', 1, true);


--
-- Name: guides guides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guides
    ADD CONSTRAINT guides_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

