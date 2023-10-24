var required = ["adapter","kurento","createjs","easytimer","bufferloader","id3minimized","audiovisualisierung","ztoast"],
	calls = window.opener.parent.vy_msn_calls,
    type = window.opener.parent.vy_msn_calls.media_type,
    peer_id = window.opener.parent.vy_msn_calls.peer_id,
    user_id = window.opener.parent._U.i,
    pr = window.opener.parent,
    messenger = window.opener.parent.messenger,
    socket = pr.sio,
    call_method = calls.call_method,
    call_type = calls.call_type,
    localStream,
    wss,
    is_screenshare,
    freq_initialised,
    from_notif,
    caller_id = 0,
	video_elem_local,
	video_elem_remote,
	socket_notif_created,
	call_1_ended,
	webRtcPeer,
	easy_timer = null,
	timer,
	last_message_send,
	shouldFaceUser = true,
	registerName = null,
	NOT_REGISTERED = 0,
	REGISTERING = 1,
	REGISTERED = 2,
	registerState = null,
	NO_CALL = 0,
	PROCESSING_CALL = 1,
	IN_CALL = 2,
	callState = null,
	ringing_timeout = null,
	busy_status_timeout = {},
	close_call_click_timeout = {},
	config = {},
	metadata = {},
	spinner = "data:image/gif;base64,R0lGODlhPAA8APcAAEbf8Ejf8Fji8Xjo9Ijq9abw+Kfw+Lby+eP6/ekMWekPW+skae9NhvFilPSLsPafvfza5vzb5v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAwASACwAAAAAPAA8AAAI/gAlCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqVLhggKDBAQIICAAQUQOITggMECBQoWMHAAASMCAgCSKl1KQGfCCA0SSJ1KtUGEigcCLN2qNMABhA8UUB07VcGDiQa4qlVqwKADsnCnOoh4YK1dAF8HPojLN8FZhwi03lUbwGkEsX3hKrjaEOngtQQERk0ct0FDBI/vIoBAuW/RhQUy2y3wtnPcuQsHiF47gIHpuAwYClitVsCC13AXMBRMe2kAxLipKtjde+vv4GOHL5xdXKlt5FR1p26utDX0qbFBU09K+rpU1AoxaG/f7D3B54WOi0eWMBm55cu8VxcWeBj54od1e+cVuDf434dprdZWQaWZBh5EWT3mFVjA8WVWRUfd1ZRCUPVllVEy0WQTTk4xxJNPQAlF1EsklmjiiSimqOKKLLbo4oswxijjjDTW2FFAACH5BAkEADMALAAAAAA8ADwAh0bf8FDg8FHh8Vzi8V3j8mjl8mjl83Pn83Tn9HidwH/p9Ivr9Yvr9pbt9pd2pJft96Lv96tbka7x+bnz+b9BfsX1+sX1+9D3+9z5/N4ZYuj7/ekMWeoaYuobY+spbesqbe04d+05eO5Igu5JgvBXjPBYjfFmlvFnl/J1ofN2ovP9/vSFq/WUtviyy/izy/rC1fvR4P3g6v7v9P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGcIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuHFR4gEAAAAAIGFlQolOHixIgNGzqMSOGCYwUCNZMqFSABIYsOQKNK/dAi4wKlWJUa0DlQRgipYKWesKjCQNazNQlgEAjjQ9i3QEPIoKgArd2tXuHqLTERgt2/CEToHbwiogqaf+1SGKy3w9yHDRL/TcBYb+GHAyT/zVD57YeHGjT/jdD5bQyHF0TbdVA67AuYqtGybi21asMKsc/Opg3UNsPUubHu5v26YejgSknzBnraYWbkNTkv9wAxMnTKyzdcdqgiAPTFyzlqPH7oN7gCwcu3Q6wbu4AKGSB4k6CoooDqAWtnwPDQGsT4iVdJ5h5B8HVmQkYVPHdWABM4xYFeHviGYAMHeAfAAQtUwBVCMrRgAnociICChC+VaOKJKKao4oostujiizDGKOOMNNZo40YBAQAh+QQJAwA2ACwAAAAAPAA8AIdG3/BP0eZQ0eZQ4PBR4fFaxN1bxN1c4vFd4/Jo5fJo5fNz5/N05/R/6fSA6fWDkLeL6/WL6/aXdqSi7/ej7/irW5Gt8fiu8fm58/m68/q/QX7F9frKM3XQ9/vc+fzo+/3pDFnqGmLqG2PrKW3rKm3tOHftOXjuSILuSYLwV4zwWI3xZpbz/f70hav0hqz1lLb3o8D3pMH6wtX70eD94Or+7/T///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBtCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLhx8yOFAAAAACBhQ8IJzhAgUJECBMqIhBwyMLCgRqKl3KoANBGSiASp0qwkWNjR4QLN269ILAF1PDTiUxI+OGpFzTAoiwQqxboCJkXPSAVm1aCW/fiihb8YDdvxryuiVRccLfvwYEu31BccDhvxUUhxUxscPjvw8kh5Ub0fBltQI0T20hccFnu6Klpih9Wi2H1CBOsG7N9XVq2RFN094KG8TqzruXBuhNOqLl4DUzw+Yc0THyyKlDUPS8u0BvxhT97g6cuoRFD85PW+ONzrdih/CPIbQVHaL8d+2HLXzVPML9RRYT0G9d4HSgjBN5hdDCVR19gEEDCdR0wAIT6HTQDC2cMAJQJaQAQ1EvZajhhhx26OGHIIYo4ogklmjiiSimqOJHAQEAIfkECQMAOgAsAAAAADwAPACHRt/wT9HmUNHmUODwUeHxW8TdXN3uXOLxXd3uXePyZLjTaOXyaOXzbqvKc+fzdOf0eJ3Af+n0gOn1i+v1l3akoWibou/3o+/4rfH4ufP5uvP6v0F+yjN1y0uFy0yF0Pf73Pn86Pv96QxZ6hpi6htj6ylt6ypt7Th37Tl47kiC7kmC8FeM8FiN8WaW8WeX8/3+9IWr9Ias9ZS29ZW296PA96TB+sLV+9Hg/eDq/u/0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AdQgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly4ggLjxIAAAAAwkaQhDEUYMFChEiTKiIcUPkhwc1kyolcOFFjhgkgEqdqsLGRwxKsypF4GGq16kzOk7QSramgA1f07rYaKGsWwEc0n6FkfGD27sF5H61evHA3bsV9E41cTHD37sCBE+lYXHsYbdoFYtoYXHAY7cUJIsgYfGyWwiaRVS065lsg9BFJ5IunfW05tQTWWsFrbmybKWZJY9ofDtpZMWUKxruHSA0Y4t+bweWXALj6tIKQvO92LZ0gLiS6Wp0/Pi65uAbsUQeNtBBs4yPHxy4HWDBKYwRelNM/wjCgoPkCyJk0DkQB40VJwBVQgowwPbSgQgmqOCCDDbo4IMQRijhhBRWaOGFGH4UEAAh+QQJBAA+ACwAAAAAPAA8AIdG3/BP0eZQ0eZQ4PBR4fFaxN1bxN1c2etc2exc4vFd4/Jkt9RkuNNo5fJo5fNz5/N05/R4ncB5nMF/6fSDj7eDkLeL6/WL6/aW7faXdqSX7fei7/et8fi2Toi3YpW58/m/QX7F9frF9fvQ9/vUJmvc+fzeGWLpDFnqGmLqG2PrKW3rKm3tOHftOXjuSILuSYLwV4zxZpbxZ5fydaHzdqLz/f70hav1lbb3o8D4ssv4s8v6wtX70eD+7/T///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gB9CBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqVLiTVEXIAAAAABCBpECMxB40WKEydeyNDRoyQHAjWTKkXgAajTpyluiKzhQKlVpRSeaj3RoqjHEgquiq25wMRWpyt4dKQ6tq2Es067cnzQtm4GuEBfbBxRt64As3h3aJzQ1y7eEzAy1ihc18DhE14tfmBcl8RhHBg3UG4L4rCNzJvHdvAMOvTV0Xg/X9Rs2mrn1Bgnt1ZqGS/mi4tn1yzwOLJFwrrv4k2cke/sAIDhCtZIt7VwuMQ11mhgOsJhFr4zlkiwmUHyrSrUQHqczrjC9ewdOQxoe6ApXBS3R9YIYaH5gAcYQuyc4QIFUBcx5IDeSwQWaOCBCCao4IIMNujggxBGKOGEFFbYUUAAIfkECQMALAAsAAAAADwAPACHRt/wT9HmUNHmUODwUeHxXOLxZLfUZLjTaOXyaOXzbqvKc+fzdOf0g4+3g5C3i+v1i+v2oWibq1uRrODsrd/trfH4rvH5tk6IufP5xfX61CZr352935696Pv96QxZ6hpi6htj7Th37Tl47kiC7kmC8WaW8WeX9ZS29ZW296PA+LLL/eDq////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AWQgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4odLDBIAABAAgYUOJAQ4cGDCBIoVqDsAKGm0aMAGmjoydSDCaEkMxBAShWAgAtNe4JQMRJD1a8AJGTtmSKkV7BfsY7l6rHDVLRVBSzNCgIqxwdwwToY66FExw550c7NajdjhcBgI/A9wXEB4q8K+I7gWOBxVQN8RXC0/JWvh82cqXqmHProAb4hGpc2Gnns5I2HVwNQPJbxRsCyBzctnBFv6b1j/f4dEDqA7p4feGvMEFptVrYfzyIWO7asyAzE4QZwzvQDdJEdfDF/dXC8r3LwFRYgqIlgwYQNI0L0DDHixPmX+PPr38+/v///AAYo4IAEFmjggQgm6FFAACH5BAkDADsALAAAAAA8ADwAh0bf8E/R5lDR5lDg8FHh8VrE3VvE3Vzi8V3j8mS31GS402jl8mjl82+qynDB2XHB2nPn83Tn9HidwH/p9IWmx4Wnxovr9Zbt9pd2pJft96Fnm6Lv96tbkbZNiLZOiL9BfsX1+sozddD3+94ZYuj7/ekMWeoaYuobY+spbesqbe04d+05eO5Igu5JgvBXjPBYjfFmlvFnl/J1ofN2ovP9/vSFq/iyy/izy/rC1f3g6v7v9P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AHcIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuLIDJEIAAAwAMKHUacaDHjBksQCGoKHSpAQ4mjKWyktDC06dAEI46WiGGSBgOnWGsaCCF1hQ6SE7KKhSr1xcgNYtM2kFqiRkgaNNOK/SD1xNePF+SmlcDW7ccDetNGRfqRROC0HNjm8CjisFgMbHF4BOE4K2SpSjtSruz08tHMHBtzbuq5hOSOhkcPTSx1sUfAqmsOLoECZN7YfKX69UhjQGy6R03c/Yh2dO6ju0GGraxgtguSNBY4LsD1qIrhI5nqbS4VRkoQsLEsBmBNG/T3CxB8A3BQwcMIEyxkmH9Jv779+/jz69/Pv7///wAGKOCABBY4UkAAIfkECQQAOQAsAAAAADwAPACHRt/wT9HmUNHmUN3uUODwUd3vUeHxWsTdW8TdXOLxXePyZs7jbqvKb6rKc+fzftvrf9vrg4+3g5C3l3akmYyzmou0oWeboWibou/3o+/4q1uRufP5uvP6v0F+wEuFwEyGxfX6yjN10HCe0HGf0Pf73Pn86Pv96QxZ6hpi6htj6ylt6ypt7Th37kiC8FeM8/3+9IWr9Ias9ZS296PA96TB+sLV+9Hg/eDq/u/0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AcwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly4smOEBYAAAAggYVRtC44fJFhgI1gwpt8CEGjpUlFAhdKtTCChspQRhgSrVmhBQ1TpaYWrXqhBRQSyboSrbDipIYyJJFcEIGSQJqyWpIMZJEXLISTmQNmfZuVQEnYIh04LfrCReDC1cN0SKxYqaMHT8Welhk38k1AwQWaRdzzbx7Q8L1rAEFycuPD7QVi7kDC5MlRheegCJsSRKy40qonbLE2LgXVNhG+QLDgK4MPMA42tLEhgc0ARxgQEHEDJ4vs2vfzr279+/gww2LH0++vPnz6NOrPxkQACH5BAkDADUALAAAAAA8ADwAh0bf8E/R5lDd7lDg8FHd71Hh8VrE3VvE3Vzi8V3j8mbO42jl8m6rym+qynPn837b63/b63/p9IOQt5d2pJmMs5qLtKFom6Lv96Pv+Ktbka3x+Lnz+brz+r9BfsBLhcBMhtBwntBxn9D3+9z5/Oj7/ekMWeoaYuobY+spbesqbe5IgvP9/vSFq/SGrPejwPekwfiyy/rC1fvR4P3g6v7v9P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGsIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuLM16EqNDgAAAACiBwIOGSRosPDW4KHUoAw4qVMlJYGMp0aIIRKWGckNC06s0CIk7KODHBqtcCUEui6OC1bIKSLEoYKFtWA0kTGdiWLTAyRgmqcr1mDZk2QF6vF0SqKPHXawTBZAtXdYBY8WLBhB0zPcy3hF/JQgOHtIsXM4C9IeF6BjCAZNq1mN2SHIt5gUkZJroqHhC2ZAwTneXSTikDxVK5CGqjpMHCAwOvAi4cbTnDBQgKDFAreLCB58vr2LNr3869u/fv4MMLix9Pvrz58+hPBgQAIfkECQMAOwAsAAAAADwAPACHRt/wT9HmUNHmUODwUeHxWsTdW8TdXOLxXePyZLfUZLjTaOXyaOXzbqvKcMHZccHac+fzdOf0eJ3Af+n0gOn1habHhafGi+v1i+v2lu32l3akl+33oWibou/3q1uRtk2Itk6Iv0F+xfX6xfX7yjN10Pf73hli6Pv96QxZ6hpi6htj6ylt6ypt7Th37Tl47kiC7kmC8FeM8WaW8nWh83ai8/3+9IWr+LLL+sLV/eDq/u/0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AdwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4s3aMBQYeJDhQcAABCIsGEEyxssUAjlICCn0aMIRKSUIRSFiQRHox7FYFKHi6YkDEjdmpNBDZIxmj7lSpbCSBtNUTQgy7ZDSB0qmoZgy5bA148z0kqg2xbkCrF82SL4mCOth8BsT3jEkVYDYrIlPN5o/Jir0o6TmzquLPUyR8aaOUuN3LFw08Oijyr2+FeoidRGD4DM23QvbLcfdaSQC3vA3Y9om64VjTtkWNcKOE8gqaMF1gKPF/weyRR54Aspb7RGwSEA2QOesybPeJHCBAgLDnIOgJAh/Mv38OPLn0+/vv37+PPr38+/v///AI4UEAAh+QQJBAArACwAAAAAPAA8AIdG3/BP0eZQ0eZQ4PBR4fFaxN1o5fJo5fNuq8pz5/N05/SDj7eDkLeL6/WL6/ahaJurW5Gs4Oyt3+2t8fiu8fm2Toi58/nF9frUJmvfnb3fnr3o+/3pDFnqGmLqG2PrKW3tOHftOXjuSILuSYLxZpbxZ5f1lLb1lbb3o8D4ssv94Or///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBXCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqVLiipOjAjBgUOIERokKDgAAMABBRQ2oFRRoqZRDhgW9FzKFIADoSRTeDhas4KAplgBELgwEgXVmhCyigVgIaTXr2HHiuXqUcVUqhiuqs1KACpHEl85MJg7tkFHFXkx8FVrN6OJvA8Gj53AUUReBIrFJuD4IW+ByFkPcMzLAbPYzXk9Z6VsWTRTA40fm146eePhr4lXA2C8EfBXwbILZ8T7da9pv3873A4geoBujSnyVhDN9uNZqmkVlxWZQjjVCsTnDmguUgXvoxh8L4ttcLy7CREgaoIQkSFCAgM9DSSYUP6l/fv48+vfz7+///8ABijggAQWaOCBHgUEACH5BAkDADwALAAAAAA8ADwAh0bf8E/R5lDR5lDg8FHh8VrE3VzZ61zZ7Fzi8V3j8mS31GS402jl8mjl83Pn83Tn9HidwH/p9IOQt4vr9Yvr9oyDrZbt9pd2pJft96Lv967x+bZOiLdilbnz+b9BfsX1+sX1+9D3+9Qma9z5/N4ZYukMWeoaYuobY+spbesqbe04d+05eO5Igu5JgvBXjPFmlvFnl/J1ofN2ovP9/vSFq/WUtvejwPiyy/izy/rC1fvR4P7v9P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AHkIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuJO3DAaFGixIkWMnAI/IDhAQEAAB5QADGjZI0TNZMq5XAAqNOnBDSI3LFCqdUSEp5qfdqgqEcdKa4mJaFgq1mgCUZ0pCo2KYSzcLtyZNG25gW4eB9szFG3BAkBePGG0Oiib4XAeCNk3NG3RAHEeL1atNFXBGS8HTDS6OvhMtwMmvtu8HwW9MXNdUeT3mraIuq2nVdrbV2Rcl3Lsp9mvsi47+PcQCVbLFz3MHDFGfnWJREA+GCNdOvelY1c4w4Vfd+SZiA8ow4UyxdEeEag1uP1vlkRcxdZw0RdDgbgDtg9cseNF9FNsIhxY6cFBwMA5cAEH3T30oEIJqjgggw26OCDEEYo4YQUVmjhhRh6FBAAIfkECQMAOAAsAAAAADwAPACHRt/wT9HmUNHmUODwUeHxWsTdXN3uXOLxXd3uXePyaOXyaOXzbqvKc+fzdOf0f+n0gOn1i+v1i+v2l3akou/3o+/4rfH4rvH5tk6IufP5uvP6v0F+yjN1y0uFy0yF0Pf73Pn86Pv96QxZ6hpi6htj6ylt6ypt7Th37Tl47kiC7kmC8FeM8FiN8WaW8/3+9IWr9Ias9ZS296PA96TB+sLV+9Hg/eDq/u/0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AcQgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly4g1YKgwIUIEChYzbBAMoQHCAgAAEjioAEIkDRU1kyolAeOGiwoEgEqd6uDDxxhKsyr1gGCq16kXOrbQShaDgK9ogUrY+IKsVg5n06alkJGGW60F5Oq1erHEXaUT9OpNcFHGX6UBBOvNYHHsYREbFOuNYHHEYxGBJaclYPGyCAaa5Va0exl0aLRFJ5J+bPq019QTPbd2LbXy5cy0gQ5ofDlybqCUKxq+nPg3Y4t+H+N2fQDj6sN5afO92PYxh+Kh6Wp0fHgDdsXBN0VifdzBgGQLH2mkuDvihVMKA+Q2mP6xxosUyU+skKFzYIgMDygA1AENUADbSwgmqOCCDDbo4IMQRijhhBRWaOGFGGb4UUAAIfkECQQAMwAsAAAAADwAPACHRt/wT9HmUODwUeHxWsTdXOLxXePyaOXyaOXzc+fzdOf0f+n0gOn1g5C3i+v1l3akou/3o+/4q1uRrfH4ufP5uvP6v0F+0Pf73Pn86Pv96QxZ6hpi6htj6ylt6ypt7Th37Tl47kiC7kmC8FeM8FiN8WaW8WeX8/3+9IWr9Ias9ZS29ZW296PA96TB+LLL+sLV+9Hg/eDq/u/0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AZwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly4cxWpAAoUGDBxEpYCDEEEGBAQAAEDCokMGjjBQcaipdKuIFwQsKgEqdOiDCiY0wPCzdunSFwAlTw041gCGji6Rc02ow4UCsW6ADLlyEgVYt1wdv8w4oW7GD3bQW8go2UBHF37QEBAueQHHD4a0SFAseMPHF460NJAuWG9HwZaUBNOeFIDHEZ6Wi8y4ofVpD4NRuE7A+/Rp2WNkRTbe2LXZ159YaQvOWSjqi5daZhwPlHNHx6cjKBVD0fDrxcMYU/dIefsAiDOef8VvCFsC34gvwj0u0FU0+Iwzth1V81VygPEYZKNBvDeF04IUEeQkAwVUdxcDCCB/U1EEIKOh0EAYQJFAAUAcsQEFRL2Wo4YYcdujhhyCGKOKIJJZo4okopqjiRwEBACH5BAkDADMALAAAAAA8ADwAh0bf8FDg8FHh8Vzi8V3j8mjl8mjl83Pn83Tn9HidwH/p9IDp9Yvr9Yvr9pbt9pd2pJft96Lv96tbka3x+L9BfsX1+sX1+9D3+9z5/N4ZYuj7/ekMWeoaYuobY+spbesqbe04d+05eO5Igu5JgvBXjPFmlvFnl/J1ofN2ovP9/vSFq/WVtvejwPiyy/izy/rC1fvR4P3g6v7v9P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGcIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuHLVCM6LBhwwgTLmQoTGGhAQIAAAQggGCBY4sPNZMq7bAC4QQBQKNKJVAhYwmlWJWG0DkwhQGpYKU2sCgjRNazNT/AEIiBQNi3QA2koEgCrd2tXuHqXTBRhd2/Iw7oHRwhogyaf9FSGDxYwNyHJxLbTcCYMEQPks9mqDyYwMMYmc9K4DxYg8MXobM+IK33AszUWFezflu1YQvYSmXPBlubIWrcNXXvjuq6IWjgG0YPl2raIWbgm5cDHQAxMnLK0gs/lMEB+eLlAR5oP/QLnITg4doj1oUNQkaKArsVUJQBIrWHtTMwDGBdQPzEq5K1R9B7nDGQUQvPncUBC04FoNcAvR14ggjdbSBCCS1whVAKFTBwXgAHOBDhSySWaOKJKKao4oostujiizDGKOOMNNa4UUAAIfkECQMAGgAsAAAAADwAPACHRt/wUODwUeHxXOLxaOXyaOXzc+fzdOf0i+v1i+v2rfH4rvH5ufP5xfX66Pv96QxZ6Q9b6hNe6htj7C1v7C5w71iN71mN8mmZ832n+8XX////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4ANQgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4YZLEiI8OBBBAkWMjh0sOBAAQAAChxY4ABjBgo1kyp9QEFnQgcJgEqdCiBBUYoYlmpNigFhAwFUwwIQ0GDiha1oH1wwyECsWwAMIp5Ni7brwLZv3ZZ1mIEuXacOwOYVK+Aqwwl+004QiGDwWwQN+yZOm8GB47yGE1aYnLaCgstvFTCUwBmtBAOg3RpgCKH01ggDUostwNA1Wtlua9vWilss691KYfeeSmA08KSnh0tdvXDz8QeelQMVvVDy8crSAWROiBj4Yg2Nh2dDjnxdoIMAvQNsV5jVtl2BDXrvfTiX89qCeEHHldg+8fuCDaA3WADzSZRBd2hN4BRCDoTnFgLrGVjBTDXdVMGCCzmggAEEAEWAAQpE+NKIJJZo4okopqjiiiy26OKLMMYo44w0WhQQACH5BAkEAC4ALAAAAAA8ADwAh0bf8FDR5lDg8FHh8Vzi8V3j8mjl8mjl82+qynPn83Tn9H/p9IDp9YOPt4vr9Yvr9pbt9pft95h1pKLv963x+LZNiMX1+sX1+9D3+9z5/Oj7/ekMWekPW+oTXuobY+wjaOwtb+wucOw5eO46ee9Ige9ZjfJpmfN9p/N+p/P9/vaUtferx/vF1/3g6f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AF0IHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuHJ0Z42EDTQwgULRSmuPBAAQAAAxREuMDxBAeaSJNuKIGQwoCfUKMWsJARhNKrNDvkHJjiQNSvUR9YbNEBq1kOKwRmKAC27c8DKSh+MEtXa1e3eBlMJEG3r4cEeANPiNiir2EEgfEOiPtQhOG+FRLjHfzw6GO6ASS3LfCQxeW+DTS31eBQxWe6EkSDxQDztNnUqqNSbXjCNVbYsX/OZmjatlLcuVk39Ow7aejcP0k7tFx8Q2bkBCA6bh4ZOQDKDgs3R4xcAOOHfH1bfwCMHDvEua7tGsi9gCLZ02jVElBt4PtEq4+1EkyxXrKDjEb1ZUJTAuBFwG4AijBTTSCcsBVCKVjgAHkCJAABgi9lqOGGHHbo4YcghijiiCSWaOKJKKao4kYBAQAh+QQJAwAxACwAAAAAPAA8AIdG3/BQ4PBR4fFc4vFd4/Jkt9Ro5fJo5fNvqspz5/N05/R/6fSA6fWDj7eL6/WYdaSi7/ej7/isWpGt8fi58/m68/rQ9/vUJWzUJmvc+fzeGWLfGGLo+/3pDFnpD1vqE17qG2PrI2nsI2jsLW/sLnDuSYLvSIHvWI3vWY3yaZnya5rzfafz/f72lLX3q8f7xdf94On///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBjCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLhy9UhPjQoYMHECVcIMwQQQEBAAAOMKjAwSOMEjWTKu0AogVBCwqASp0qIAKLjS48LN1aE4XACVPDTiWQIeMKrmg7kHAgti1QARYuukib9oFbtwLKVtRKFy2Cu20JVDTRNy0GwG0nUCxMtwHisAImtmCcVsLjsHEjEqbMVcPlqRAkguCM9rPUBaJJcy1gGkCC1KqXsjb9OuLo2EpbA0CtGXfSDbpDR5zsu4Pl1pkjFu/g2HQAiptjX9CtmCJf1X9NG7A4V7Vd53orTxKnPILt5wDhuV+ne+Lr5QHpL8KIzrXp0wR3A0C42vFFChE02QSCCTodlAEECQwAlAELUFDUSxBGKOGEFFZo4YUYZqjhhhx26OGHIIb4UUAAIfkECQMANAAsAAAAADwAPACHRt/wUODwUeHxXOLxXePyZLfUaOXyaOXzb6rKc+fzdOf0drXSd7XSf+n0gOn1i+v1i+v2jYKumHWkou/3o+/4rfH4rvH5tk2IufP5uvP6wEB/yzJ10Pf71CZr3Pn83hli3xhi5RNe6Pv96QxZ6Q9b6hNe6htj6yNp7CNo7C1v7kmC70iB71iN8mmZ8mua8/3+9pS196vH+8XX/eDp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AaQgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly4gxVJggMWJEiRMuZBAUkcHBAQAACCig4EEkDBM1kyodoWLGCwoCgEqdqoDDRxZLs9YMwWCq16kWOqbQSvYDgq9oIWxcQbbthwJov07ICKOt3Q5xv1q9SNNu2wh5pxK42MKv3Q+Bp2KwONZw27OJATyw6NiuhMgABFCuTPYCZgAV63LWquFz0YmiRy8tjfn0RNVZPWPeDDvp5cgBGNdOCjnx5IqFd4P4vNhiX9iAIw/AmHr0hs97L7IdDQJu5LkaGzuujvn3RqyGQz8swFzh41G7K5xOCJA3QfSPMVbMrFkCRQudA0VgaGAA6IAEE7j20oAEFmjggQgmqOCCDDbo4IMQRijhhBR+FBAAIfkECQQAOQAsAAAAADwAPACHRt/wUNHmUODwUeHxW8TdXOLxXePyaOXyaOXzb6rKc+fzdOf0eZzBf+n0iJi9iJi+i+v1i+v2lu32l+33mHWkou/3q1uRrFqRrvH5tk2Itk6IufP5xfX6xfX7yjN1yzJ10Pf71CVs1CZr3Pn83hli3xhi4hZg6QxZ6Q9b6hNe6htj7CNo7C1v7C5w7Dl47jp570iB71iN8mmZ832n836n8/3+9pS196vH/eDp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AcwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4k4aLRQcaKmihc0BHKYsGAAAAALInSoUTJGzaNIT5h48LOp0wEYROJIkbRqTQtOswJAQNTjDRRWw3oIoLWpgREdp4Zdq6FsU64caa5dS8HtzwUbbcydS4KsXRAaV+ydW9dug4w4Bs8VYfdnV4syFM8l0HgDRhiS1yZoXOFy5rAMOHv+XDW03c4XMZNOuvk0xsirkVK2a/li4tg1QzQG8NiiYNyF3R7OqDd2Cb9uAWuUSzp42eEa1X7O0PhA74xfM39ArrUAWo/S9zpeqH69o9G1JhzYFVB7JI4ZLJircDFDpwQFAn4qgMCh/Mv/AAYo4IAEFmjggQgmqOCCDDbo4IMQdhQQACH5BAkDACgALAAAAAA8ADwAh0bf8FDg8FHh8VvE3Wjl8mjl83Pn83Tn9HmcwYOPt4vr9Yvr9o2Crqtbkaxaka3x+K7x+bTF2bXE2rnz+cBAf8X1+sozdcsydd4ZYt8YYuNdkeNekej7/ekMWekPW+oTXuobY+wtb+wucO9Yje9ZjfJpmfN9p/vF1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AFEIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuKJ0iA+NChwwcQGyQcKAAAQIEDEDigPCGiptGjHRoM6MkUwAKhJE0gnVoTA4KmPQVUGFmCqtcOCbD2nBCy61evV8Vu9Xji7FcMS7EKgMoxhNuvDsQCUNCx7d2vcbHSzTji71cGeh9wBGHYKwW9Bjh6aEzVgt4CHCl71Qsgs+apnCV/PnpBL4HFo40+Fht5Y+HUHRCLVbzRb+rATQdntDs6r1i+fUdnwN0zgG6NUjWnxbr2o1nDYcWSFZncbYblTAM0F3mCt1cHxPcqHuc+YmbNmxoiGCDQk4CBB+Nfyp9Pv779+/jz69/Pv7///wAGKOCAHgUEACH5BAkDADYALAAAAAA8ADwAh0bf8FDR5lDg8FHh8Vzi8V3j8mS31Gjl8mjl82+qynPn83Tn9HidwHmcwX/p9IDp9YOPt4vr9Yvr9oyDrZbt9pft95h1pKLv97ZNiLtQibxPiL9BfsX1+sX1+8ozdcsydc8zdNAydND3+9QlbNQma94ZYt8YYuj7/ekMWekPW+oTXuobY+wjaOwtb+w5eO46ee9IgfN9p/P9/vaUtfvF1/3g6f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AG0IHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuLMV6sQEETRAYGAQYsqNCBZYwUNIMKLTEBgNECHFK2EMpUqIcARgFIMFlDRdOrNEkYiIpABkkWWMM+jfpgJIywaDdEBXAhZA20cBNEHeD1owu4aDGsbfsRKN6wUI9+pPEXLYS1JzzOKBzWwloRHmMwxuo4atKOkic3rWz0MsfFmplyBgC5I+HQQg9HTezRL2oUgQEQAHn3td6ofD2+fS3XqIC6H8+Gvm00N0iwkz/EdkCyKuMRW40eAD5yKV7lUSOk/BnWhGrZnrclu5hJM4SGBgEEKKAQ/qX79/Djy59Pv779+/jz69/Pv7///yMFBAAh+QQJBAA3ACwAAAAAPAA8AIdG3/BQ4PBR4fFc4vFd4/Jkt9Ro5fJvqspz5/N3qMh3qMl/6fSDj7eMg62Ngq6Ss8+Ts8+YdaSi7/ej7/inbZ6obZ2rW5GsWpGt8fi58/m68/q/QX7AQH/Q9/vUJWzUJmvaI2naI2rc+fzeGWLfGGLhK2/iK27mEFvnD1vo+/3pDFnpD1vqG2PuSYLvSIHyaZnya5rzfafz/f72lLX3q8f7xdf94On///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBvCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLizVglAihQsWHDRQgaEjh0kaLEzWDCt2gYIKMlTRWCF0qtAEBESljMJ0a1IKADidpUN2qIoIAqCWVcqV6gEBJF2O3fgCAgWRargwEjJzxdusFAFhDoq07dQQACSJZ8KUKYEHgwVMLIDiMeKlixo2DFha5N7IKEn9F0rWs4m7ekJxVMAhAsjJiD2zDRj5gwKRWxBECgC25ue4F2SmTvnUwYDZKGy5QbOWQQMLRljVemABR0wOHCg8y8HxJvbr169iza9/Ovbv37+DDB4sfT778yYAAIfkECQMAMwAsAAAAADwAPACHRt/wUODwUeHxXOLxXePyb6rKc+fzd6jId6jJg4+3jYKukrPPk7PPmHWkou/3o+/4p22eqG2drFqRufP5uvP6v0F+wEB/xfX60Pf71CVs1CZr2iNp2iNq3Pn83xhi4Stv4itu5hBb5w9b6Pv96QxZ6Q9b6hNe6htj7CNo7kmC70iB71iN8mmZ8mua8/3+9pS196vH+8XX/eDp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AZwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly4sjKDCAUEEDCRIcPrSI4dLFAwQVbgodGiKFjJUdCCgYynRoCRgpLwiQ0LSq0BcnOwhoYLUrCaglBxTw2rVESQcAMpDtuoJkgARrvY7EAIBqXKtYQ6L1cNeqCpEGAPS1igLw2MFNTxhGnBiwYMZDC+sFwBfyzb8h6dq1nDfkW8s3SaJVC7ktSbGQTZjsEIArYrAlMQTYHBf26gFL1z5d6cLBAQtdRag42nLEhAURLJDeAIIFz5fQo0ufTr269evYs2vfzr279+/gwwOfDAgAIfkECQMANgAsAAAAADwAPACHRt/wUNHmUODwUeHxXOLxXePyZLfUaOXyaOXzb6rKc+fzdOf0eJ3AeZzBf+n0g4+3i+v1jYKulu32l+33mHWkou/3tk2Iu1CJvE+IwEB/xfX6yjN1yzJ1zzN00DJ00Pf71CVs1CZr3hli3xhi6Pv96QxZ6Q9b6hNe6htj6yNp7CNo7C1v7C5w7Dl47jp570iB832n836n8/3+9pS1+8XX/eDp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AbQgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4saJiwYEIDBhQ4lcqJwEYOlhgIAgkYQkbOoURMwUkIICiDABqNQjbIwKQMBUwMhomrNeaIGSQdMnW4dm2JkBaYAMoxd+yKkjAFME6yd6/WjBLQW5rIFSSCs3rUmPpJA++DvWhoeP6ClYHjsDI8aFjfemrRjZKaMJ0etzFExZs1RH3cczLQwaKOIPfYNGuB00cB28bou0fajDAFxZ9f9eJapWtC1Q4JlzUGzCpIyDlwF0biryaXE/65IqWE1gAgjxiL1KUGBgAANMB54KIqiBeeX6NOrX8++vfv38OPLn0+/vv37+POTDAgAIfkECQQAJwAsAAAAADwAPACHRt/wUODwUeHxW8TdXOLxaOXyaOXzc+fzdOf0eZzBg4+3i+v1i+v2jYKuq1uRrFqRrfH4rvH5tMXZtcTaufP5wEB/xfX61CVs3hli3xhi412R416R6Pv96QxZ6hNe6htj7C1v7C5w71iN71mN8mmZ832n+8XX////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4ATwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4ocIiAwAACAAQQTNnzw0KGDhw8jTKDkwKCmUQADHPRcyrRDCKEkLQg4WjMBhqZYe5YYSYFqTQVZw3YgEbKrV7Biw271yGEq1QFX04aFynGBVwAP5IoF0ZHD3QF609LNCOFug8BiRXA8cLcC4rAfOBK4e+FxVg8c7wKwHDbzXc5ZJVMGzRTzRsZeHZPuGXljYa+HV3dQvNGvV8CyB2e06zUvab59A9zOQFq3Rgt3E4Be+9EsVbSIyYq0IJxqAuJ6mYvkwPvoAN9hQSoY3w7hQIGaBQ5I0LCz508R41/Kn0+/vv37+PPr38+/v///AAYo4IAeBQQAIfkECQMANwAsAAAAADwAPACHRt/wUNHmUODwUeHxW8TdXOLxXePyaOXyaOXzb6rKc+fzdOf0eZzBf+n0iJi9iJi+i+v1i+v2lu32l+33mHWkoWebou/3rFqRrfH4tk2IufP5xfX6xfX7yjN1yzJ10Pf71CVs3Pn83hli3xhi4hZg6QxZ6Q9b6hNe6htj7CNo7C1v7C5w7Dl47jp570iB71mN8mmZ832n836n8/3+9pS196vH/eDp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AbwgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlS4kzOERYAADAgAUTOAiM0QJFiZ8oVsiwURLDgJpIkz4g8bOp0xIvRM5AkLQqgAtPs/48QdRjCANWkQbooLWsiRodp4ZFmqGsW64cFaytScGtXRQbP8wFEECEXbs0NDbYW+Gv3RQZZ+wFAMKw3a4WNewl4NguDIwW9iao7NYF5r0MOJf1fDHz3NCis5K2aHrt5tRPV1eUPJcybKeXLyre2/j2T8gWB88t7BtxRr1zA4zwHVij3Ll1YRvXOOPA3rai4XIMUSC5B85nPztW34vVsHaQGATMdcDUbe6RMzZAeC5AgYQNO1n4BKoiBvCXAAYo4IAEFmjggQgmqOCCDDbo4IMQRvhRQAAh+QQJAwAyACwAAAAAPAA8AIdG3/BQ4PBR4fFc4vFd4/Jkt9Ro5fJo5fNvqspz5/N05/R2tdJ3tdJ5nMF/6fSA6fWL6/WYdaSi7/ej7/it8fi58/m68/rAQH/Q9/vUJWzc+fzeGWLfGGLlE17o+/3pDFnpD1vqE17qG2PrI2nsI2jsLW/sLnDuSYLvSIHvWI3vWY3yaZnya5rz/f72lLX3q8f7xdf94On///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBlCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLiBomKCAAAMCBBxY8EITBYkSIDx9AiDjxQiQGBTWTKhUwoUWME0CjSv0gwsVHCkqzKmXQYapXoCo6QtBKtsGGr2hNbJRAVmuBs2jRosiIoa3WDHHzWr04wK7SCHnzgrhYwa9SDoHzrrA41jAABInzlrAYwDEAwJHjWrQM4EJmzRTrWvb8+WvRiaIdky499fREzqtZR6VsGbPs2RUbG4Z8G+jkioUtI+692GJfx7ZZD76Y2jBe2XsvsnVcYPjnuRp1+0VgPfHvjVgdPy/omjjFRwwJ7AaQ4BRF3qoiNUhIcNyAgwo6B8JYQeJnUBEouPbSgAQWaOCBCCao4IIMNujggxBGKOGEFH4UEAAh+QQJBAAuACwAAAAAPAA8AIdG3/BQ4PBR4fFc4vFd4/Jo5fJo5fNvqspz5/N05/R/6fSA6fWDj7eL6/WL6/aYdaSi7/ej7/isWpGt8fiu8fm58/m68/rF9frQ9/vUJWzc+fzfGGLo+/3pDFnpD1vqE17qG2PrI2nsI2jsLW/uSYLvSIHvWI3yaZnya5rz/f72lLX3q8f7xdf94On///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBdCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLhxwsLDAAAACBBBE0IFxBAoSHDh0+hEDBwmOKCAJqKl2aAANBFSCASp3agUSLjRoILN26lIJAE1TDAvWwIuOFpFzTAnAwQqzbDiouakCrluuDt2/LVhxQN+0BvG89VITQN20GwG9NUAxQeCsDxHgnYmi8VQLkt3EjEqasdMNltyUkIuCs9LNbEaJJA/hrOiyI1KRZt576OuJo1bOpotasGoDn3EBDR5ys2jJwuBMZk358nOJm0odzK6bIN3buDxY1KOd8t7Xeihi2TTdu0Pbz9+zVC0/4CpnsxhQQxG9F4HQgVLwlrnbkUEFBgZoDIACBTgetUIJPQH0gwglFveTggxBGKOGEFFZo4YUYZqjhhhx26OGHHwUEACH5BAkDAC4ALAAAAAA8ADwAh0bf8FDR5lDg8FHh8Vzi8V3j8mjl8mjl82+qynPn83Tn9H/p9IOPt4vr9Yvr9pbt9pft95h1pKLv967x+bZNiLnz+cX1+sX1+9D3+9z5/Oj7/ekMWekPW+oTXuobY+sjaewjaOwtb+wucOw5eO46ee9Ige9YjfN9p/N+p/P9/vaUtferx/vF1/3g6f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AF0IHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUuHFiAoGAAAgAIHF1IobIFChIcNQD2QQMHRQoGaSJMOmIDQBNCnUDdwOJGxQdKrSQ/oHNiiQ9SvQEVYTHEAq9maBTIIXMEBrNsOLSguOEtXa1e3eD9MlEC3r4KfePGWiJiCZt+zCAIrjvvwwWG6FBQHHvyQwGOzASQH5vBQw2WzDDQHZuEQw2esEUTjVQHz9NXUqsFSbWjBdVLYsaPOZmjadk3cuZ+ybujZN4DQwaGSdmjZd+bkQDk3Ng4gMnTKDlMIMJ4YOuOHfH1dLwCcGzvEua4NpLgbGwTFFAZOE1Drgq1quBatPlZPkL3iEBlZ0JxZAlTQ1Ga7BfhAAtsBkEADFmyFUAsnhECeByMk+NKGHHbo4YcghijiiCSWaOKJKKao4oosbhQQADsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
	blank = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=';
/* debugger
window.onerror = function(msg, url, lineNo, columnNo, error) {
    alert('msg ' + msg);
    alert('url ' + url);
    alert('lineno: ' + lineNo);
    alert('columnNo: ' + columnNo);
    alert('error: ' + error);
    return false;
}*/

 
function set_header_status(t){

	document.title = t;
}
function nodots(){
	$('#vymsn_call_status').addClass('nodots');
}
function loadCss(){  
// load css 
for(var i in pr.vy_ms_calls_css_assets) {
const css = Object.keys(pr.vy_ms_calls_css_assets[i])[0];
if(css == 'messenger' || css =='dark-theme' || css == 'ztoast') {
let cssnode = document.createElement('link');
 
cssnode.media = "all";
cssnode.type = 'text/css';
cssnode.rel = 'stylesheet';
cssnode.onload = function(){ $('body').fadeIn('slow');};
cssnode.href = pr.vy_msn_path + Object.values(pr.vy_ms_calls_css_assets[i]) + '?v='+pr.vy_ms_v;
document.head.appendChild(cssnode);
}
}
}
function loadAssets(){
let count = 0;
loadCss();
pr.vy_ms_v = Math.random() * 100;
return new Promise((resolve, reject) => {
for(var i in pr.vy_ms_calls_js_assets) {
	let script = document.createElement('script');
	const js = Object.keys(pr.vy_ms_calls_js_assets[i])[0];
if(required.indexOf(js) != -1){ 
if(typeof pr.vy_ms_calls_js_assets[i][js] == 'object')
for(var x =0; x < pr.vy_ms_calls_js_assets[i][js].length; x++)
	if(pr.vy_ms_calls_js_assets[i][js][x].includes('.js'))
	script.src = pr.vy_msn_path + pr.vy_ms_calls_js_assets[i][js][x] + '?v='+pr.vy_ms_v;
else 
	script.src = pr.vy_msn_path + pr.vy_ms_calls_js_assets[i][0] + '?v='+pr.vy_ms_v;
 
script.type = 'text/javascript';
script.onload = function(){ count++;  if(count >= required.length) {resolve(true);}};
document.head.appendChild(script);
}
}
});


}
function set_status(c,seconds,metadata){
	

		let lang = pr.lang;
		let c_status = function(title,header_title){
		
			header_title = header_title || title;
			set_header_status( header_title );
			document.getElementById('vymsn_call_status').innerHTML = title;
		
		}

		
		switch(c){
		
		
			case 'connecting':
			c_status(lang['Call_Contacting...']);
			break;
		
			case 'rejected':
			c_status(lang['Call_rejected']);
			call_ended('rejected');
			break;
			case 'reject_status':
			c_status("I'm Busy! I call you back later.","Busy");
			
			break;
			case 'started':
			c_status(seconds);
 
			break;
			
			case 'callended':
			c_status(lang['call_ended'],seconds);
			break;
			
			case 'no_answer':
			c_status(lang.call_no_answer,lang.call_no_answer);
			break;
			
			case'another_call':
			c_status("Is on another call.","Line Busy");
			break;
			
			case 'ringing':
			c_status(lang['Call_Ringing...']);
			break;
			case 'disconected':
			c_status("Recipient is disconnected.","Disconnected");
			break;
			case 'answered':
			c_status(lang['Call_Connecting...']);
			break;
			 
			case 'offline':
			c_status("I'm offline, i will call back soon.","Offline");
			break;
			
			case 'unavailable_stream':
			c_status(lang.call_recipient_err_stream.replace('%uname',metadata.user_name).replace('%calltype',metadata.call_type),'Call ended.');
			call_ended('no_stream');
			break;
		
		
		}
		

}
function close_popup(){
calls.close_desktop_popup();
}
function socketId(id){

	return pr.socketId(id);

}
function getTurnCredentials(){
        return new Promise(async (resolve, reject) => {

            let send = await pr.jAjax(calls.ajax_url, 'post', {
                'cmd': 'get-turn-credentials'
            }).done(function(json) {
            	eval('config=' + json);
                resolve(true);
            });

        });


}
function browser_dosent_support_mediadevice(){

			const msg = "Your browser dosen't support Video/Audio calls.";
			const send = jAjax(calls.ajax_url,'post',{cmd:'call-error',msg:msg});
			send.done(function(html){
				 
				body.find('#vy-ms__call_error_popup_info').remove();
				body.prepend(html);
			});
			
			setTimeout(function(){window.close()},5000);
			socket.emit('call_unavailable_stream',socketId(peer_id));
			//ws_sendMessage({id:'call_unavailable_stream',communication:true,from:socketId(user_id),to:socketId(peer_id)});

}
async function createSounds(){
		
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.on("fileload", function() {}, this);

        for (var i in pr.vy_msn_sounds)
            createjs.Sound.registerSound(pr.vy_msn_sounds[i], i);

}
 
async function connect(){
 
 		await loadAssets();
 		createSounds();
 
 		_getUserMedia(function(stream){


			if(call_method == 'call')
				initiateCall(stream);
			else if(call_method == 'answer')
				initiateIncomingCall(stream);

 		});
 

}
function shareScreenSupported() {

return navigator.mediaDevices &&
            "getDisplayMedia" in navigator.mediaDevices;

}
async function _getUserMedia(callback, mob){
 

		if (!navigator.mediaDevices)
			return browser_dosent_support_mediadevice();

 
            if ('permissions' in navigator) {
            	if(type == 'audio') {	
					 navigator.permissions.query({name: 'microphone'})
					 .then((permissionObj) => {
					   console.log(permissionObj.state);
					 })
					 .catch((error) => {
					  return browser_dosent_support_mediadevice(error);
					 });
				}
				if(type == 'video') {	
					 navigator.permissions.query({name: 'camera'})
					 .then((permissionObj) => {
					  console.log(permissionObj.state);
					 })
					 .catch((error) => {
					  return browser_dosent_support_mediadevice(error);
					 });
				}

			 }

	    /*let def_audio = {
					    autoGainControl: false,
					    channelCount: 2,
					    echoCancellation: true,
					    noiseSuppression: true,
					    sampleRate: 48000,
					    sampleSize: 16
					  };*/

	    let def_video = {facingMode: "user"};
 		let constraints = {audio:true,video:false};

 		if(type == 'video')
 			constraints['video'] = true;
 
 
            if (mob || mobileAndTabletCheck()) {
                
            if(type == 'video') 
                constraints.video = {
                    width: {
                        min: 1024,
                        ideal: 4096,
                        max: 4096
                    },
                    height: {
                        min: 576,
                        ideal: 2160,
                        max: 2160
                    }
                };



            	if(type == 'audio') {
            		constraints.audio['echoCancellation'] = false;
            	 	//constraints.audio['deviceId'] = headphone ? {exact: headphone.id} : undefined; 
            	}
                if(type == 'video') constraints.video['facingMode'] = shouldFaceUser ? 'user' : 'environment';

                if (iOS()) {
                    constraints.video['width'] = 640;
                    constraints.video['height'] = 480;
                }
                
            }

            if(type == 'video') constraints.video['frameRate'] = { ideal: 15, max: 30 };
 
		navigator.mediaDevices.getUserMedia(constraints).then(stream => {
				addScreenShareButton();
 				addSwitchCamBtn();
				get_media_input(type,0);
            	setSrcObject(stream);
            	if(callback) callback(stream);
 


            
        }).catch(function(err){  

    
			calls.show_error_popup(err+'.'+calls.microphone_camera_err_msg);
			call_ended('error',false,err); 
			 
        }); 

} 
function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
function mobileAndTabletCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
function start_freq(stream){
 
		$('.vy_msn_fullbg_anim,#msn_freq').addClass('msn_animateHue').removeClass('__none');

		if(freq_initialised) freq_reset();

	    loader = new BufferLoader();
	    initBinCanvas();
		hasSetupUserMedia = true;
	  	//convert audio stream to mediaStreamSource (node)
		microphone = context.createMediaStreamSource(stream);
		//create analyser
		if (analyser === null) analyser = context.createAnalyser();
		//connect microphone to analyser
		microphone.connect(analyser);
		//start updating
		rafID = window.requestAnimationFrame( updateVisualization );

		freq_initialised = true;

}
function get_media_constraints(type){
const constraints = {
	audio: true,
	video: type == 'video' ? true : false
	};

return constraints;

}
function get_media_input(type,remote,els){

video_elem_local = document.getElementById('vy-ms__user-video-element');
video_elem_remote = document.getElementById('vy-ms__recipient-video-element');

if(!els) setTimeout(videoHover,2000);

return remote ? video_elem_remote : video_elem_local;
}
function call_realtime_notifications(){
	if(socket_notif_created) return;
		
	socket_notif_created = 1;

		// user is connected, call him
		socket.on("call_user_connected", function(uid){
 			
 			if(ringing_timeout != null) return;
		 
			stopSound('contacting');
		
			playSound('ringing',1);

			
			set_status('ringing');


			ringing_timeout = setTimeout(function(){


				call_ended('no-answer',1);
				
			},60000);

		});

		
		// user rejected the call
		socket.on("call_rejected", function(uid){
 		
			set_status('rejected');
			call_ended('rejected',1);
		});
		// stream unavailable
		socket.on("call_unavailable_stream", function(uid){
 
			set_status('unavailable_stream');
 			call_ended('no_stream',1);
		});
}
async function initiateIncomingCall(stream, method){  

		// connect to websocket
		socket_connect(peer_id,function(){
			socket.emit('call_user_connected',socketId(peer_id));

		register(async function(){
				ws_sendMessage({id:'call_answered',communication:true,from:socketId(user_id),to:socketId(peer_id)});
				performAcceptedIncomingCall(false,1);
				showFooter();
			});
 		


		});
}

async function performAcceptedIncomingCall(id,initial_call) {


		if (!config || Object.keys(config).length <= 0)
			await getTurnCredentials();

		const options = {
					localVideo : get_media_input(type,0,1),
					remoteVideo : get_media_input(type,1,1),
					onicecandidate : onIceCandidate,
					mediaConstraints: get_media_constraints(type),
					iceServers: config,
					videoStream:localStream,
					onerror : error
		};
 
 		 
		config = {};
		showSpinner(video_elem_local,video_elem_remote);
		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
				function(error) {
					if (error) {
						console.error(error);
						setCallState(NO_CALL);
					}

					this.generateOffer(function(error, offerSdp) {
						if (error) {
							console.error(error);
							setCallState(NO_CALL);
						}

						var response = {
							id : id || 'incomingCallResponse',
							from : peer_id,
							callResponse : 'accept',
							sdpOffer : offerSdp
						};
						ws_sendMessage(response);


					if(initial_call) {
						  get_media_input(type,1).onloadedmetadata = function(e) {
				 
							start_timer();
							setTimeout(function(){  
								bg_effect();
								ws_sendMessage({id:'call_started',communication:true,from:socketId(user_id),to:socketId(peer_id)});
							},150);
							$('html').removeClass(`incall ${type}`).addClass(`incall ${type}`);
						  };
					  }


					});
		});


}
function bg_effect(){

	const el = $('#msn_bg_eff');

	el.hide().removeClass('__none');
	setTimeout(function(){el.fadeIn(700);},350);
	$('#vymsn_footer_controls_btns').removeClass('__none');

	if(type == 'audio')
		start_freq(video_elem_remote.srcObject);

}
function start_timer(t){

		if(easy_timer != null) return;

        const timer_opts = t ? {
            precision: 'seconds',
            startValues: {
                secondTenths: 7,
                seconds: t.s,
                minutes: t.m,
                hours: t.h,
                days: t.d
            }
        } : {
            precision: 'seconds'
        };
        let daysLabel, hoursLabel, minutesLabel, secondsLabel, totalSeconds = 0;


        easy_timer = new easytimer.Timer(timer_opts);

        easy_timer.start({
            callback: function(_timer) {
                self.current_min = _timer.getTimeValues().toString(['minutes']);

            }
        });

        easy_timer.addEventListener('secondsUpdated', function(e) {
            const _time = self.easy_timer.getTimeValues();

            daysLabel = _time.days;
            hoursLabel = _time.hours;
            minutesLabel = _time.minutes;
            secondsLabel = _time.seconds;


            if (daysLabel <= 0)
                daysLabel = '';
            if (hoursLabel <= 0)
                hoursLabel = '';
            if (minutesLabel < 10)
                minutesLabel = "0" + minutesLabel;
            if (secondsLabel < 10)
                secondsLabel = "0" + secondsLabel;

            hoursLabel = (daysLabel > 0 ? ":" : "") + hoursLabel;
            minutesLabel = (hoursLabel > 0 ? ":" : "") + minutesLabel;

            self.current_sec += 1;
            timer = daysLabel + hoursLabel + minutesLabel + ':' + secondsLabel;
			set_header_status( 'Call: '+timer );
			document.getElementById('vymsn_call_status').innerHTML = timer;
			nodots();
        });


}
function initiateCall(stream, method){

		
		var send = pr.jAjax(pr.ajax_url,'post',{'cmd':'initiate-call','type':type,'recipient':escape(peer_id)});
 
		send.done(function(data){ 
 
			const r = pr.validateJson(data);
			
			if(r.blacklist >= 1)
				return call_ended('blacklist');
			
			if(r.peer_id <= 0)
				return call_ended('cant_receive_signal');
			
			if(r.status == 'another_call')
				return call_ended('another_call');
			
			if(r.status == 'offline')
				return call_ended('offline');
			
			if(r.status == 'cant_receive_signal')
				return call_ended('cant_receive_signal');
						

				metadata = {

							'user_name': pr._U.fn,
							'user_avatar': pr._U.p,
							'user_id': pr._U.i,
							'call_type':type

					};


						playSound('contacting',1);

						// set peer status
	 					calls.set_peer_status('another_call');
						
						// receive notifications
						call_realtime_notifications();

						// connect to websocket
						socket_connect(peer_id,function(){
							register(function(){
								call();
								showFooter();
								hangup_btn().addClass('__callinitiator');
							});
							
						});
 
			
		});

}
function hangup_btn(){

	return $('#vymsn_hang_up');
}
function socket_connect(peer_id,callback) {

        if (wss && wss.readyState === WebSocket.OPEN) {
            if (callback) callback();
            return wss;
        }

  

        wss = new WebSocket(`wss://${pr.CHAT_NODE_HOST}/vy_msn?peer=${peer_id}&u=${pr._U.i}`);


		wss.onmessage = function(message) {
			var parsedMessage = JSON.parse(message.data);

			switch (parsedMessage.id) {
			case 'registerResponse':
				resgisterResponse(parsedMessage);
				break;
			case 'callResponse':
				callResponse(parsedMessage);
				break;
			case 'incomingCall':
				incomingCall(parsedMessage);
				break;
			case 'startCommunication':
				startCommunication(parsedMessage);
				break;
			case 'stopCommunication':
				console.info("Communication ended by remote peer");
				stop(true);
				break;
			case 'iceCandidate':
				webRtcPeer.addIceCandidate(parsedMessage.candidate)
				break;
			case 'videochat_denied':
			    videoChatDenied();
			break;

			case 'videochat_removed':
				from_notif = 1;
				$('#vymsn_remove_video').trigger('click');
			break;

			case 'videochat_request_notif':

			recipientRequestingVideoChat();
 
			break;

			case 'videochat_approved':
			videoChatApproved();
			break;



			case 'switched_tovideochat':
			switchedToVideoChat();
			break;


			case 'call_answered':
			stopSound('ringing');
			set_status('answered');
			break;


			case 'call_unavailable_stream':
				set_status('unavailable_stream',false,metadata);
			break;

			case 'call_started':


				setTimeout(function(){
					stopSound('all');
				},100);
				start_timer();
				bg_effect();
				$('html').addClass(`incall ${call_type}`);
				if(ringing_timeout != null) {clearTimeout(ringing_timeout);ringing_timeout = null;}



			break;
			case 'call_finished':
			call_ended('finished');
			break;
			default:
				console.error('Unrecognized message', parsedMessage);
			}
		}
        wss.addEventListener('open',async function(event) {

           console.log("%ckontackt conn.s.~MSN~.!", "color: green; font-size:11px;");
			if (!config || Object.keys(config).length <= 0)
				await getTurnCredentials();

            ws_sendMessage({
                id: 'ices',
                ices: JSON.stringify(config.iceServers)
            });

            if (callback) callback();
            
        });
 

}
function error(txt){
	const e = $('#vymsn_call_error');
	e.html(txt)
	e.show();
}

function call_ended (c,initiator,err_msg){
	 	
		if(c == 'blacklist'){
			
			setTimeout(function(){
				playSound('busy');
			},50);
			nodots();
			busy_status_timeout = setTimeout(function(){
				set_header_status( "Blacklisted" );
				set_status('You can not call this user. You are in blacklist.');
			},100);

			close_call_click_timeout =  setTimeout(function(){
				
				close_popup();
				
			},9000);
		} 
		
		if(c == 'rejected'){
			
			setTimeout(function(){
				stopSound('ringing');
				playSound('busy');
			},100);
 
			//ws_sendMessage({id:'call_rejected',communication:true,from:socketId(user_id),to:socketId(peer_id)});
			busy_status_timeout = setTimeout(function(){set_status('reject_status');},1500);
 			nodots();
			
			close_call_click_timeout =  setTimeout(function(){
				close_popup();
				
			},9000);
		} 
		
		if(c == 'another_call'){
			
			setTimeout(function(){
				stopSound('all');
				playSound('busy');
			},50);
			 
			busy_status_timeout = setTimeout(function(){set_status('another_call');},100);
			sendMessage('missed');
			nodots();
			close_call_click_timeout =  setTimeout(function(){
				
				close_popup();
				
			},9000);
		}
		
		if(c == 'cant_receive_signal'){
			
			setTimeout(function(){
				stopSound('all');
				playSound('busy');
			},50);
			 
			busy_status_timeout = setTimeout(function(){set_status('disconected');},100);
			sendMessage('missed');
			nodots();
			close_call_click_timeout =  setTimeout(function(){
				
				close_popup();
				
			},9000);
		}
		if(c == 'offline'){

 
			setTimeout(function(){
				playSound('busy');
			},50);
			nodots();
			busy_status_timeout = setTimeout(function(){
				set_status('offline');
				set_header_status('Offline');
			},100);
			calls.sendMessage('missed');
			
			close_call_click_timeout = setTimeout(function(){
				close_popup();
				
			},9000);
		}
		if(c == 'no-answer'){
			
			setTimeout(function(){
				stopSound('ringing');
				playSound('noanswer');
			},100);
			socket.emit("call_stopped", socketId(peer_id));
 
			setTimeout(function(){
			 	nodots();
				set_status('no_answer');
				
			},150);
 
			
			close_call_click_timeout =  setTimeout(function(){
				
				close_popup();
				
			},18000);
			
		}

			
			

		if(c == 'error' || c == 'notif'){
			
			setTimeout(function(){
				stopSound('all');
				playSound('busy');
			},50);
			nodots();
			busy_status_timeout = setTimeout(function(){

				set_header_status( c == 'error' ? "Error" : "Call finished" );
				set_status(err_msg);
				},100);
 
			
			close_call_click_timeout =  setTimeout(function(){
				
				close_popup();
			},9000);
			
			
			
		}
		
		if(c == 'no_stream')
			
		
		{
			nodots();
			
			setTimeout(function(){
				stopSound('all');
				playSound('busy');
			},50);
			 
 
			close_call_click_timeout =  setTimeout(function(){
				
				close_popup();
				
			},9000);
			
			
		}
		
		
		if(c == 'finished'){ 
			nodots();
			setTimeout(function(){
	 
				stopSound('all');
			},100);
 

			
			set_status('callended',timer);
			ws_sendMessage({id:'call_finished',communication:true,from:socketId(user_id),to:socketId(peer_id)});



				close_call_click_timeout =  setTimeout(function(){
					
					close_popup();
				},1000);

		}
		
		
 
		
		if(hangup_btn().hasClass('__callinitiator')){  
			if(c == 'finished' && timer)
				sendMessage('ended',timer);
			else
				sendMessage('missed');
		} 

	 	calls.set_peer_status('available');
		stop(true);
		wss.close();
	}
function playSound(id,lp){
	let instance;
	if(lp)
		instance = createjs.Sound.play(id, {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
	else
		instance = createjs.Sound.play(id);

	instance.on("complete", function() {}, this);
}
function stopSound(id){

if(id == 'all'){
        for (var i in pr.vy_msn_sounds)
            createjs.Sound.stop(pr.vy_msn_sounds[i]);
	
} else {
	 createjs.Sound.stop(id);
	}
}
function setRegisterState(nextState) {
	registerState = nextState;
}
function setCallState(nextState) {
	callState = nextState;
}

function register(callback) {
	var name = pr._U.fn;
	if (name == '') {
		window.alert("You must insert your user name");
		return;
	}

	setRegisterState(REGISTERING);

	var message = {
		id : 'register',
		name : name
	};
	ws_sendMessage(message);
	
	if(callback) return callback();
}
function resgisterResponse(message) {
	if (message.response == 'accepted') {
		setRegisterState(REGISTERED);
	} else {
		setRegisterState(NOT_REGISTERED);
		var errorMessage = message.message ? message.message
				: 'Unknown reason for register rejection.';
		console.log(errorMessage);
		alert('Error registering user. See console for further information.');
	}
}

function callResponse(message) {

	if (message.response != 'accepted') {
		console.info('Call not accepted by peer. Closing call');
		var errorMessage = message.message ? message.message
				: 'Unknown reason for call rejection.';
		console.log(errorMessage);
		stop(true);
	} else { 
		setCallState(IN_CALL);
		webRtcPeer.processAnswer(message.sdpAnswer);
	}
}

function startCommunication(message) {
	setCallState(IN_CALL);
	webRtcPeer.processAnswer(message.sdpAnswer);
}

 
function call() {
	if (peer_id == '' || peer_id <= 0) {
		return error("You must specify the peer name");
	}


	setCallState(PROCESSING_CALL);

	caller_id = pr._U.i;
 
	performNewCall();

}
async function performNewCall(id){

	if (!config || Object.keys(config).length <= 0)
		await getTurnCredentials(); 


		const options = {
				localVideo : get_media_input(type,0,1),
				remoteVideo : get_media_input(type,1,1),
				onicecandidate : onIceCandidate,
				mediaConstraints: get_media_constraints(type),
				videoStream: localStream,
				iceServers: config,
				onerror : error
	};

	config = {};
	showSpinner(video_elem_local,video_elem_remote);
	webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(
			error) {
		if (error) {
			console.error('errorrrrrrrrr1',error);
			setCallState(NO_CALL);
		}

		this.generateOffer(function(error, offerSdp) {
			if (error) {
				console.error('errorrrrrrrrrr2',error);
				setCallState(NO_CALL);
			}
 
			var message = {
				id : id || 'call',
				from : user_id,
				to : peer_id,
				type:type,
				sdpOffer : offerSdp
			};
			ws_sendMessage(message);
		});
	});


}
function stop(message) {
	setCallState(NO_CALL);
	if (webRtcPeer) {
		webRtcPeer.dispose();
		webRtcPeer = null;

		if (!message) {
			var message = {
				id : 'stop'
			}
			ws_sendMessage(message);
		}
	}
	hideSpinner(video_elem_local,video_elem_remote); 
}

function ws_sendMessage(message) {
	var jsonMessage = JSON.stringify(message);
	wss.send(jsonMessage);
}
function onIceCandidate(candidate) {

	var message = {
		id : 'onIceCandidate',
		candidate : candidate
	}
	ws_sendMessage(message);
}
function crossEvent() {

        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }

}
function hideFooter(){

return $('footer').addClass('slidedown');

}
function showFooter(){
return $('footer').removeClass('slidedown');
}
function hangup(e){
	e.preventDefault();
	const call_initiator = caller_id == pr._U.i ? true : false;
	call_ended('finished',call_initiator);
	hideFooter();
	
}
function err(s){
return calls.show_error_popup(s);
}
function replaceStreamTracks() {

        if (webRtcPeer == null) return err('Error while trying to switch your video source, please try again.');
        webRtcPeer.peerConnection.getSenders().map(function(sender) {
            sender.replaceTrack(localStream.getTracks().find(function(track) {
            	if(track != null && sender.track != null)
                	return track.kind === sender.track.kind;
            	else
            		return track === sender.track;
            }));
        });

}
function stopTracks(){
	if (localStream) 
        localStream.getTracks().forEach(track => track.stop()); // stop each of them
}
// stop only camera
function stopVideoTracks() {
if (localStream) 
    localStream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
        }
    });
}

// stop only mic
function stopAudioTracks() {
if (localStream) 
    localStream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'audio') {
            track.stop();
        }
    });
}
function activebtn(b){
	b = $(b);

	if(b.hasClass('active'))
		b.removeClass('active');
	else
		b.addClass('active');
}
 
function shareScreen(event,button){
event.preventDefault();
 
	is_screenshare = 1;
if(type == 'audio') {
	ws_sendMessage({id:'videochat_request_notif',communication:true,from:socketId(user_id),to:socketId(peer_id)});
 
	requestingVideochatMarkup();
	playSound('req_video_waiting',1);

} else {
stopTracks();
setTimeout(function(){getScreenShare(button)},250);
}

}
async function getScreenShare(b){
 
try {
		let getScreenData = await navigator.mediaDevices.getDisplayMedia({video: true,audio: true});

		stopSound('req_video_waiting');

     	if(type == 'audio'){   
     	stopTracks();
     	stop(true); 
		type = 'video';
		updateLocation(); 
		performNewCall('requestvideo'); 
		switchToVideoChat(); 

     	} else {
     	replaceStreamTracks();
     	}
 		if(b)
     	 activebtn(b);
 
		getScreenData.getVideoTracks()[0].onended = function () {

			stopTracks();
	
			_getUserMedia(async function(stream){
				if(b) activebtn(b);
				setTimeout(replaceStreamTracks,250);
				 

			});
		
		};
		setSrcObject(getScreenData);
		ws_sendMessage({id:'switched_tovideochat',communication:true,from:socketId(user_id),to:socketId(peer_id)});
} catch (e) {
        console.error('error',e);
}

}
function setSrcObject(stream){

	video_elem_local.srcObject = stream;
	localStream = stream;
}
 
function toggleaudio(){
	localStream.getAudioTracks()[0].enabled = !(localStream.getAudioTracks()[0].enabled);
}
function togglevideo(){
	localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
}
function muteMicrophone(event,button){

event.preventDefault();

activebtn(button);

button = $(button);
 
if(!button.hasClass('muted')){
	button.html(pr.vy_ms_svgi.calls_mute_microphone);
	button.addClass('muted');
	toggleaudio();
	setTimeout(replaceStreamTracks,250);
}else{
	button.html(pr.vy_ms_svgi.calls_microphone);
	button.removeClass('muted');
	toggleaudio();
	setTimeout(replaceStreamTracks,250);
}


}

function videoHover(){  
	const video = $(video_elem_local);
	const b = $('body');
	const mask = $('#vy_msn_videohov');
	const arrow_show = $('#vy_msn_call_local_arrow_show');
    const arrow_hide = $('#vy_msn_call_local_arrow_hide');

	video.off('mouseenter mouseover').on('mouseenter mouseover',function(e){
		estop(e);
		mask.addClass('visible').css({'width':video.width(),'height':video.height(),'left':video.offset().left,'top':video.offset().top});
	});
 	mask.off('mouseenter mouseover').on('mouseenter mouseover',function(e){
 		estop(e);
 		arrow_hide.css('margin-left','-5px');
 	}).off('mouseleave mouseout').on('mouseleave mouseout',function(e){
 		estop(e);
		$(this).removeClass('visible');
		arrow_hide.css('margin-left','0px');
	}).off('click').on('click',function(e){

		estop(e);
		toggleLocalVideo(arrow_show,arrow_hide);
		
	});
	let arrows_css = {'left':(video.offset().left + video.width())-15,'top':video.offset().top};
	arrow_hide.removeClass('__none').css(arrows_css);
	arrows_css['left'] = 10;
	arrow_show.css(arrows_css);
	arrow_hide.off('click').on('click',function(e)
	{
		estop(e);
		toggleLocalVideo(arrow_show,arrow_hide);

	});
	arrow_show.off('click').on('click',function(e)
	{	
		estop(e);
		toggleLocalVideo(arrow_show,arrow_hide);
		video.removeAttr('style');

	}).off('mouseenter mouseover').on('mouseenter mouseover',function(e)
	{
		estop(e);
		if(!b.hasClass('hide_local_video')) return;
		video.css('transform','translateX(-90%)');
	}).off('mouseleave mouseout').on('mouseleave mouseout',function(e)
	{
		estop(e);
		if(!b.hasClass('hide_local_video')) return;
		video.css('transform','translateX(-110%)');
	});
}

function toggleLocalVideo(as,ah){  

	const b = $('body');
 
	if(!b.hasClass('hide_local_video')) {
		b.addClass('hide_local_video').on(crossEvent(),function(){
			ah.addClass('__none');
			as.removeClass('__none');

		});

	}
	else {
		b.removeClass('hide_local_video').on(crossEvent(),function(){
			ah.removeClass('__none');
			as.addClass('__none');
		});

	}

}

function removeVideoChat(e,button){
	if(e) estop(e);
	button = $(button);
	type = 'audio';
	updateLocation();
	togglevideo();
	stopVideoTracks();

	_getUserMedia(function(stream){ 
			setTimeout(replaceStreamTracks,250);
			setTimeout(function(){start_freq(video_elem_remote.srcObject);},500);
	}); 


	$('html').removeClass('incall video');
	$('#vymsn_videocall_media').addClass('__none');
	$('#vymsn_remove_video').addClass('__none');
	$('#vymsn_request_video').removeClass('__none');
 
	if(!from_notif)
		ws_sendMessage({
		id : 'videochat_removed',
		to : socketId(peer_id),
		from:socketId(user_id),
		communication:true
	});

	from_notif = false;
}
function estop(e){
	e.preventDefault();
	e.stopImmediatePropagation();
}
function requestVideoChat(e,button){
	estop(e);
	button = $(button);
 
 	ws_sendMessage({id:'videochat_request_notif',communication:true,from:socketId(user_id),to:socketId(peer_id)});
	requestingVideochatMarkup();
	playSound('req_video_waiting',1);
} 
function videoChatApproved(){
	stopSound('req_video_waiting');
	remove_requestingVideochatMarkup();
 
	if(is_screenshare)
		getScreenShare($('#vymsn_share_screen'));
	else
		caller_switchToVideoChat();

	is_screenshare = 0;
}
function caller_switchToVideoChat(){
 
	if(type == 'audio'){ 
	stopTracks();
	stop();
	type = 'video';
	_getUserMedia(function(stream){ 
		updateLocation();
		performNewCall('requestvideo');
		switchToVideoChat();
		ws_sendMessage({id:'switched_tovideochat',communication:true,from:socketId(user_id),to:socketId(peer_id)});
	}); 

	} else {
	togglevideo();
	setTimeout(replaceStreamTracks,250);
	ws_sendMessage({id:'switched_tovideochat',communication:true,from:socketId(user_id),to:socketId(peer_id)});
	}
	freq_reset();
 
}
function switchToVideoChat(){
	$('html').addClass('incall video');
	$('#vymsn_videocall_media').removeClass('__none');
	$('#vymsn_remove_video').removeClass('__none');
	$('#vymsn_request_video').addClass('__none');
}
 
async function recipientRequestingVideoChat(){
 
	playSound('req_video_waiting',1);
	const r = await confirm_videochat();

 
	if(r) approveVideoChatRequest();
	 else
	 	deniedVideoChatRequest();
 

}
function approveVideoChatRequest(){
	type = 'video';
	ws_sendMessage({id:'videochat_approved',communication:true,from:socketId(user_id),to:socketId(peer_id)});
}
 
function switchedToVideoChat(){
 
	updateLocation();
 	stopTracks();
	stop(true);
	_getUserMedia(function(stream){

		performAcceptedIncomingCall('acceptingVideoRequest');
 		switchToVideoChat();
				

	});

}
function deniedVideoChatRequest(){
	var response = {
		id : 'videochat_denied',
		to : socketId(peer_id),
		communication:true,
		from: socketId(user_id)
	};
	ws_sendMessage(response);
}
 
function updateLocation(){

let new_loc = window.location.href;
new_loc = new_loc.replace(type == 'video' ? 'audio' : 'video',type);
window.history.pushState(false, false, new_loc);

}
function confirm_videochat(){

        return new Promise(async (resolve, reject) => {
			const body = $('body');

			if(!body.find('#vy_msn_confirm_videochat').length) {

		            let send = await pr.jAjax(calls.ajax_url, 'post', {
		                'cmd': 'get-request-videochat-confirmation-dialog',
		                'recipient': peer_id
		            }).done(function(html) {
		            	body.append(html);

		            	const approve = body.find('#vymsn_accept_videochat');
		            	const decline = body.find('#vymsn_decline_videochat');

		            	approve.off('click').on('click',function(e){

		            		stopSound('req_video_waiting');
		            		body.find('#vy_msn_confirm_videochat').remove();
		            		resolve(true);

		            	});
		            	decline.off('click').on('click',function(e){

		            		stopSound('req_video_waiting');
		            		body.find('#vy_msn_confirm_videochat').remove();
		            		resolve(false);

		            	});
		            });


			}
    });

}
function videoChatDenied(){
	
	stopSound('req_video_waiting');
	remove_requestingVideochatMarkup();
	if(type == 'video')
	removeVideoChat(0,$('#vymsn_remove_video'));

	ztoast("User rejected camera call",{
			  showClose: true,
			  type: 'info',
			  position:'top-center',
			  newerOnTop: true,
			  duration: 8000
			  
	});

}
function supportSwitchCamera(){
	const s = navigator.mediaDevices.getSupportedConstraints();
	return s['facingMode'];
}
function addScreenShareButton(){
	const button = $('#vymsn_share_screen');

	if(shareScreenSupported() === true){

		button.removeClass('__none');
	} else button.addClass('__none');
	
}
function addSwitchCamBtn(){

	const button = $('#vymsn_switch_camera');

	if(supportSwitchCamera() === true && mobileAndTabletCheck() && type == 'video'){

		button.removeClass('__none');
	} else button.addClass('__none');

}
function switch_camera(e,button){
				estop(e);

				button = $(button);

				playSound('click');
                if (localStream == null) return error('Your device dose not support flip camera mode.');
                // we need to flip, stop everything
                stopTracks();
                // toggle / flip
                shouldFaceUser = !shouldFaceUser;
                _getUserMedia(function(stream){

                	setTimeout(replaceStreamTracks,250);

                }, 1);
}

 
function getCustomMediaDevice(kind, exact) { 
  
  return new Promise(async (resolve, reject) => {
	  navigator.mediaDevices.enumerateDevices().then(function(devices){
	  let id;
	  for (let i = 0; i !== devices.length; ++i) {

	  	if(kind == 'audioinput' && exact == 'headphone'){
	  		if (devices[i].kind === 'audioinput' && /audio\w+/.test(devices[i].kind) && devices[i].label.toLowerCase().includes('head')) {
	  			id = devices[i].deviceId;
	  			label = devices[i].label;
	  		}
	  	} 
	  }
 
	  const r = {'label':label,'id':id};

	  resolve(r);

	  }).catch(function(err){

  		error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  		console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
	  	reject(err);
	  });

	});

}
function requestingVideochatMarkup(){

	const $b = $('body');

	if(!$b.find('#vymsn_requestingvideochat').length){

		$b.append('<div id="vymsn_requestingvideochat" class="vymsn_requestingvideochat"><div class="vymsn_layerovr"></div><div class="vymsn_reqvideochat_str vymsn_do215">Requesting videochat</div></div>');

	}

}
function remove_requestingVideochatMarkup(){

	$('body').find('#vymsn_requestingvideochat').remove();
}
function showSpinner() {
	const args = arguments;
	for (var i = 0; i < args.length; i++) {
		args[i].poster = blank;
		args[i].style['background-image'] = `url("${spinner}")`;
		args[i].style['background-repeat'] = `no-repeat`;
		args[i].style['background-position'] = `center`;
	}
}

function hideSpinner() {
	const args = arguments;
	for (var i = 0; i < args.length; i++) {
		args[i].src = '';
		args[i].poster = blank;
		args[i].style.background = '';
	}
} 

function sendMessage (c,time){
	
 
		if(last_message_send) return;
				 
		let t, ev = window.event || $.Event();
	 
		switch(c){

			case 'missed':
			t = `[missedcall]${user_id}-${peer_id}-${type}[/missedcall]`;
			break;
			case 'ended':
			t = `[callended]${user_id}-${peer_id}-${type}-${time}[/callended]`;
			break;

		}

		if(t)
			messenger.send(0, ev, t, peer_id);
		
		last_message_send = 1;
		
		setTimeout(function(){
			last_message_send = 0;
		},3000);
	 
	}