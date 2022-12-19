#!/bin/bash

function eurirs() {
    if [ "$2" != "eurirs" ] && [ "$2" != "euribor" ]; then
        >&2 echo "eurirs <filename> <eurirs/euribor>"
        return 1;
    fi

    filename="$1"
    type="$2"
    today=`date +%Y`

    if [ "$type" = "eurirs" ] ; then
        echo "DATE,10Y,15Y,20Y,25Y,30Y" > "$filename"
    else
        echo "DATE,1M,3M,6M,12M" > "$filename"
    fi

    for y in {1999..2019} ; do
        >&2 echo "$2 $y"
        2>/dev/null curl "https://www.euribor.it/$2-$y/" \
            | htmlq table \
            | grep -E '<(tr|th|td)>' \
            | sed -E 's|</t[hdr]>||g;s|<t[rdh][^>]*>||g' \
            | tr '\n' '|' \
            | sed 's/||/\n/g;s/|/,/g;s/^,//g;s/,$//g;s/\(EURIRS|EURIBOR\)/DATE/g;s/ ANNI/Y/g;s/ MESI/M/;s|\(..\)/\(..\)|'"$y"'/\2/\1|g' \
            | tail -n +2 \
            | sort \
            >> "$filename"
    done

    for y in {2020..$(( $today - 1 ))} oggi ; do
        >&2 echo "$2 $y"
        2>/dev/null curl "https://www.euribor.it/$2-$y/" \
            | htmlq table \
            | sed -E 's!<tr>!\n!g;s|</t[rhd]>||g;s|<t[dh][^>]*>|,|g;s|^,||g;s|,$||g;s|</*thead>||g;s|</*tbody>||g;s|</*table>||g' \
            | cut -d, -f2- \
            | sed 's!/*\(EURIRS|EURIBOR\)!DATE!g;s/ ANNI/Y/g;s/ MESI/M/;s|\(..\)/\(..\)|'"$y"'/\2/\1|g;s|10(01|'"$y"'/01/10|g;s/oggi/'"$today"'/g' \
            | tail -n+3 \
            | sort \
            >> "$filename"
    done
}

eurirs euribor{.csv,} && eurirs eurirs{.csv,}