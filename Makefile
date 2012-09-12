coverage:
	mv apis apis-old
	jscoverage --no-highlight apis-old apis
	mocha -t 10000 -R html-cov > coverage.html
	rm -rf apis
	mv apis-old apis

.PHONY: coverage